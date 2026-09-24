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
var IntegrationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const company_constants_1 = require("../company/company.constants");
let IntegrationsService = IntegrationsService_1 = class IntegrationsService {
    prisma;
    logger = new common_1.Logger(IntegrationsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async notifyPostRejected(data) {
        const settings = await this.getIntegrationSettings();
        if (!settings.notifyOnPostRejected)
            return;
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
    async notifyContractSigned(data) {
        const settings = await this.getIntegrationSettings();
        if (!settings.notifyOnContractSigned)
            return;
        await this.dispatch('contract.signed', settings, {
            title: 'Contrato assinado',
            message: `"${data.contractTitle}" de ${data.clientName} foi assinado.`,
            fields: [
                { label: 'Origem', value: data.source === 'portal' ? 'Portal do Cliente' : 'Interno' },
            ],
            url: '/contracts',
        });
    }
    async dispatch(event, settings, payload) {
        const tasks = [];
        if (settings.slackWebhookUrl) {
            tasks.push(this.sendSlack(settings.slackWebhookUrl, event, payload));
        }
        if (settings.discordWebhookUrl) {
            tasks.push(this.sendDiscord(settings.discordWebhookUrl, event, payload));
        }
        await Promise.allSettled(tasks);
    }
    async sendSlack(webhookUrl, event, payload) {
        try {
            const emoji = event === 'post.rejected' ? ':x:' : ':white_check_mark:';
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
        }
        catch (error) {
            this.logger.warn(`Slack webhook failed: ${String(error)}`);
        }
    }
    async sendDiscord(webhookUrl, event, payload) {
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
        }
        catch (error) {
            this.logger.warn(`Discord webhook failed: ${String(error)}`);
        }
    }
    async getIntegrationSettings() {
        const companyId = company_constants_1.DEFAULT_COMPANY_ID;
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
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = IntegrationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map