import { NotificationsService } from '../../notifications/notifications.service';
import { ReminderNotification, ReminderNotifier } from '../application/ports/reminder-notifier';
export declare class BellReminderNotifier extends ReminderNotifier {
    private readonly notifications;
    constructor(notifications: NotificationsService);
    notify(notification: ReminderNotification): Promise<void>;
}
