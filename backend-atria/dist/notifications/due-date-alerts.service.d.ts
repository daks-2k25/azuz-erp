import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
export declare class DueDateAlertsService {
    private readonly prisma;
    private readonly notifications;
    private readonly logger;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    handleDailyDueDateAlerts(): Promise<void>;
    dispatchDueDateWarnings(): Promise<{
        created: number;
        tasks: number;
    }>;
    private startOfTodayInSaoPaulo;
}
