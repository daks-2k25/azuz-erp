"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ClientRequestNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRequestNotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const mail_service_1 = require("../mail/mail.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
let ClientRequestNotificationService = ClientRequestNotificationService_1 = class ClientRequestNotificationService {
    prisma;
    config;
    mail;
    notifications;
    logger = new common_1.Logger(ClientRequestNotificationService_1.name);
    constructor(prisma, config, mail, notifications) {
        this.prisma = prisma;
        this.config = config;
        this.mail = mail;
        this.notifications = notifications;
    }
    notifySubmitted(input) {
        void this.dispatch(input).catch((error) => {
            const detail = error instanceof Error ? error.stack : String(error);
            this.logger.error(`Failed to notify admins about client request "${input.title}": ${detail}`);
        });
    }
    async dispatch(input) {
        const admins = await this.resolveAdmins(input.companyId);
        const recipients = this.resolveRecipientEmails(admins);
        if (admins.length === 0 && recipients.length === 0) {
            this.logger.warn(`No agency admin found for company ${input.companyId}`);
            return;
        }
        if (admins.length > 0) {
            await this.notifications.notifyNewRequest(admins.map((admin) => admin.id), input.title, input.clientName, { companyId: input.companyId });
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
    async resolveAdmins(companyId) {
        return this.prisma.user.findMany({
            where: {
                companyId,
                isActive: true,
                role: { name: { in: [client_1.RoleName.MASTER, client_1.RoleName.ADMIN] } },
            },
            select: { id: true, email: true },
            orderBy: { createdAt: 'asc' },
        });
    }
    resolveRecipientEmails(admins) {
        const configured = this.config.get('ADMIN_EMAIL')?.trim() ||
            this.config.get('AGENCY_ADMIN_EMAIL')?.trim();
        if (configured) {
            return [
                ...new Set(configured
                    .split(',')
                    .map((email) => email.trim().toLowerCase())
                    .filter((email) => email.includes('@'))),
            ];
        }
        return [
            ...new Set(admins
                .map((user) => user.email.trim().toLowerCase())
                .filter((email) => email.includes('@'))),
        ];
    }
    buildPortalLink(clientId) {
        const base = this.resolveAppUrl();
        return `${base}/clients/${clientId}`;
    }
    resolveAppUrl() {
        const explicit = this.config.get('APP_URL')?.trim() ||
            this.config.get('FRONTEND_URL')?.trim();
        if (explicit) {
            return explicit.replace(/\/$/, '');
        }
        const corsOrigin = this.config.get('CORS_ORIGIN')?.trim();
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
    buildHtml(input) {
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
    escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
};
exports.ClientRequestNotificationService = ClientRequestNotificationService;
exports.ClientRequestNotificationService = ClientRequestNotificationService = ClientRequestNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        mail_service_1.MailService,
        notifications_service_1.NotificationsService])
], ClientRequestNotificationService);
//# sourceMappingURL=client-request-notification.service.js.map