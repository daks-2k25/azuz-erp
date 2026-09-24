import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
export interface LeadArrivalNotificationInput {
    leadName: string;
    organizationId: string;
    companyId: string;
    actorId?: string;
}
export declare class LeadNotificationService {
    private readonly prisma;
    private readonly notifications;
    private readonly logger;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    notifyLeadCreated(input: LeadArrivalNotificationInput): void;
    private dispatch;
    private resolveRepresentativeUserIds;
}
