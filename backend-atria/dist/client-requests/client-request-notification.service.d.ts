import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import type { ClientRequestAlertInput } from '../mail/mail.types';
export declare class ClientRequestNotificationService {
    private readonly prisma;
    private readonly config;
    private readonly mail;
    private readonly notifications;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService, mail: MailService, notifications: NotificationsService);
    notifySubmitted(input: ClientRequestAlertInput): void;
    private dispatch;
    private resolveAdmins;
    private resolveRecipientEmails;
    private buildPortalLink;
    private resolveAppUrl;
    private buildHtml;
    private escapeHtml;
}
