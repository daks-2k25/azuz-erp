export interface ReminderNotification {
  userId: string;
  companyId: string;
  title: string;
  message: string;
}

/** Canal de entrega do lembrete (hoje: sino do sistema). */
export abstract class ReminderNotifier {
  abstract notify(notification: ReminderNotification): Promise<void>;
}
