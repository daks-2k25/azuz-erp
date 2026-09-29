import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { NotificationsService } from '../../notifications/notifications.service';
import {
  ReminderNotification,
  ReminderNotifier,
} from '../application/ports/reminder-notifier';

/** Entrega o lembrete no sino de notificações do sistema. */
@Injectable()
export class BellReminderNotifier extends ReminderNotifier {
  constructor(private readonly notifications: NotificationsService) {
    super();
  }

  async notify(notification: ReminderNotification): Promise<void> {
    await this.notifications.createMany(
      [notification.userId],
      NotificationType.TIME_CLOCK_REMINDER,
      notification.title,
      notification.message,
      { companyId: notification.companyId },
    );
  }
}
