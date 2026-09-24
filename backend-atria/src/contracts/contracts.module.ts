import { Module } from '@nestjs/common';
import { FinanceModule } from '../finance/finance.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  imports: [FinanceModule, NotificationsModule],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
