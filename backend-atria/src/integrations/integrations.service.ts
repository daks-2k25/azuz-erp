import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_COMPANY_ID } from '../company/company.constants';

export type IntegrationEvent =
  | 'post.rejected'
  | 'contract.signed';

interface IntegrationPayload {
  title: string;
  message: string;
  fields?: Array<{ label: string; value: string }>;
  url?: string;
}

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async notifyPostRejected(data: {
    postTitle: string;
    clientName: string;
    reason: string;
    source: 'portal' | 'internal';
    postId: string;
  }) {
    const settings = await this.getIntegrationSettings();
    if (!settings.notifyOnPostRejected) return;

    await this.dispatch('post.rejected', settings, {
      title: 'Post rejeitado pelo cliente',
      message: `"${data.postTitle}" de ${data.clientName} foi rejeitado.`,
      fields: [
        { label: 'Origem', value: data.source === 'portal' ? 'Portal do Cliente' : 'Interno' },
        { label: 'Motivo', value: data.reason },
      ],
      url: `/content/${data.postId}`,
    });
  }

  async notifyContractSigned(data: {
    contractTitle: string;
    clientName: string;
    contractId: string;
    source: 'portal' | 'internal';
  }) {
    const settings = await this.getIntegrationSettings();
    if (!settings.notifyOnContractSigned) return;

    await this.dispatch('contract.signed', settings, {
      title: 'Contrato assinado',
      message: `"${data.contractTitle}" de ${data.clientName} foi assinado.`,
      fields: [
        { label: 'Origem', value: data.source === 'portal' ? 'Portal do Cliente' : 'Interno' },
      ],
      url: '/contracts',
    });
  }

  private async dispatch(
    event: IntegrationEvent,
    settings: {
      slackWebhookUrl: string | null;
      discordWebhookUrl: string | null;
    },
    payload: IntegrationPayload,
  ) {
    const tasks: Promise<void>[] = [];

    if (settings.slackWebhookUrl) {
      tasks.push(this.sendSlack(settings.slackWebhookUrl, event, payload));
    }
    if (settings.discordWebhookUrl) {
      tasks.push(this.sendDiscord(settings.discordWebhookUrl, event, payload));
    }

    await Promise.allSettled(tasks);
  }

  private async sendSlack(
    webhookUrl: string,
    event: IntegrationEvent,
    payload: IntegrationPayload,
  ) {
    try {
      const emoji =
        event === 'post.rejected' ? ':x:' : ':white_check_mark:';
      const blocks = [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${emoji} *${payload.title}*\n${payload.message}`,
          },
        },
      ];

      if (payload.fields?.length) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: payload.fields
              .map((f) => `*${f.label}:* ${f.value}`)
              .join('\n'),
          },
        });
      }

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks }),
      });
    } catch (error) {
      this.logger.warn(`Slack webhook failed: ${String(error)}`);
    }
  }

  private async sendDiscord(
    webhookUrl: string,
    event: IntegrationEvent,
    payload: IntegrationPayload,
  ) {
    try {
      const color = event === 'post.rejected' ? 0xe74c3c : 0x2ecc71;
      const embed = {
        title: payload.title,
        description: payload.message,
        color,
        fields: payload.fields?.map((f) => ({
          name: f.label,
          value: f.value.slice(0, 1024),
          inline: false,
        })),
        timestamp: new Date().toISOString(),
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });
    } catch (error) {
      this.logger.warn(`Discord webhook failed: ${String(error)}`);
    }
  }

  private async getIntegrationSettings() {
    const companyId = DEFAULT_COMPANY_ID;
    const settings = await this.prisma.agencySettings.findUnique({
      where: { companyId },
      select: {
        slackWebhookUrl: true,
        discordWebhookUrl: true,
        notifyOnPostRejected: true,
        notifyOnContractSigned: true,
      },
    });

    return {
      slackWebhookUrl: settings?.slackWebhookUrl ?? null,
      discordWebhookUrl: settings?.discordWebhookUrl ?? null,
      notifyOnPostRejected: settings?.notifyOnPostRejected ?? true,
      notifyOnContractSigned: settings?.notifyOnContractSigned ?? true,
    };
  }
}
