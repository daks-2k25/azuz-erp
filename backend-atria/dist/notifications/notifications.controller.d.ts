import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: AuthenticatedUser, unreadOnly?: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        taskId: string | null;
        appUpdateId: string | null;
        createdAt: string;
    }[]>;
    getUnreadCount(user: AuthenticatedUser): Promise<number>;
    markAllAsRead(user: AuthenticatedUser): Promise<{
        success: boolean;
    }>;
    markAsRead(user: AuthenticatedUser, id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        taskId: string | null;
        appUpdateId: string | null;
        createdAt: string;
    }>;
}
