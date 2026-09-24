import { Module } from '@nestjs/common';
import { KanbanModule } from '../kanban/kanban.module';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ClientRequestNotificationService } from './client-request-notification.service';
import { ClientRequestsController } from './client-requests.controller';
import { ClientRequestsService } from './client-requests.service';

@Module({
  imports: [KanbanModule, MailModule, NotificationsModule],
  controllers: [ClientRequestsController],
  providers: [ClientRequestsService, ClientRequestNotificationService],
  exports: [ClientRequestsService],
})
export class ClientRequestsModule {}
