import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoleName } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import type { ClientRequestAlertInput } from '../mail/mail.types';

@Injectable()
export class ClientRequestNotificationService {
  private readonly logger = new Logger(ClientRequestNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
    private readonly notifications: NotificationsService,
  ) {}

  notifySubmitted(input: ClientRequestAlertInput): void {
    void this.dispatch(input).catch((error: unknown) => {
      const detail = error instanceof Error ? error.stack : String(error);
      this.logger.error(
        `Failed to notify admins about client request "${input.title}": ${detail}`,
      );
    });
  }

  private async dispatch(input: ClientRequestAlertInput): Promise<void> {
    const admins = await this.resolveAdmins(input.companyId);
    const recipients = this.resolveRecipientEmails(admins);
    if (admins.length === 0 && recipients.length === 0) {
      this.logger.warn(
        `No agency admin found for company ${input.companyId}`,
      );
      return;
    }

    if (admins.length > 0) {
      await this.notifications.notifyNewRequest(
        admins.map((admin) => admin.id),
        input.title,
        input.clientName,
        { companyId: input.companyId },
      );
    }

    if (recipients.length === 0) {
      return;
    }

    const portalLink = this.buildPortalLink(input.clientId);
    const subject = `Nova solicitação: ${input.title}`;
    const text = [
      'Uma nova solicitação foi enviada pelo portal do cliente.',
      '',
      `Cliente: ${input.clientName}`,
      `Tipo: ${input.requestType}`,
      `Título: ${input.title}`,
      `Link: ${portalLink}`,
    ].join('\n');

    this.mail.sendInBackground({
      to: recipients,
      subject,
      text,
      html: this.buildHtml({
        clientName: input.clientName,
        requestType: input.requestType,
        title: input.title,
        portalLink,
      }),
      templateParams: {
        client_name: input.clientName,
        request_type: input.requestType,
        title: input.title,
        portal_link: portalLink,
      },
    });
  }

  private async resolveAdmins(companyId: string) {
    return this.prisma.user.findMany({
      where: {
        companyId,
        isActive: true,
        role: { name: { in: [RoleName.MASTER, RoleName.ADMIN] } },
      },
      select: { id: true, email: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  private resolveRecipientEmails(
    admins: Array<{ email: string }>,
  ): string[] {
    const configured =
      this.config.get<string>('ADMIN_EMAIL')?.trim() ||
      this.config.get<string>('AGENCY_ADMIN_EMAIL')?.trim();

    if (configured) {
      return [
        ...new Set(
          configured
            .split(',')
            .map((email) => email.trim().toLowerCase())
            .filter((email) => email.includes('@')),
        ),
      ];
    }

    return [
      ...new Set(
        admins
          .map((user) => user.email.trim().toLowerCase())
          .filter((email) => email.includes('@')),
      ),
    ];
  }

  private buildPortalLink(clientId: string): string {
    const base = this.resolveAppUrl();
    return `${base}/clients/${clientId}`;
  }

  private resolveAppUrl(): string {
    const explicit =
      this.config.get<string>('APP_URL')?.trim() ||
      this.config.get<string>('FRONTEND_URL')?.trim();
    if (explicit) {
      return explicit.replace(/\/$/, '');
    }

    const corsOrigin = this.config.get<string>('CORS_ORIGIN')?.trim();
    if (corsOrigin) {
      const first = corsOrigin
        .split(',')
        .map((origin) => origin.trim().replace(/^["']|["']$/g, ''))
        .find(Boolean);
      if (first) {
        return first.replace(/\/$/, '');
      }
    }

    return 'http://localhost:3000';
  }

  private buildHtml(input: {
    clientName: string;
    requestType: string;
    title: string;
    portalLink: string;
  }): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
        <h2 style="margin: 0 0 16px;">Nova solicitação no portal</h2>
        <p style="margin: 0 0 16px;">Uma nova solicitação foi enviada pelo portal do cliente.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px;">Cliente</td>
            <td style="padding: 8px 0;">${this.escapeHtml(input.clientName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Tipo</td>
            <td style="padding: 8px 0;">${this.escapeHtml(input.requestType)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Título</td>
            <td style="padding: 8px 0;">${this.escapeHtml(input.title)}</td>
          </tr>
        </table>
        <p style="margin: 24px 0 0;">
          <a href="${this.escapeHtml(input.portalLink)}" style="display: inline-block; background: #004949; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 8px;">
            Abrir no portal
          </a>
        </p>
        <p style="margin: 12px 0 0; font-size: 12px; color: #6b7280;">
          ${this.escapeHtml(input.portalLink)}
        </p>
      </div>
    `.trim();
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
