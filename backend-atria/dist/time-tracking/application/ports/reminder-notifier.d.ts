export interface ReminderNotification {
    userId: string;
    companyId: string;
    title: string;
    message: string;
}
export declare abstract class ReminderNotifier {
    abstract notify(notification: ReminderNotification): Promise<void>;
}
