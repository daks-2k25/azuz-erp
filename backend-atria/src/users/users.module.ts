import { Module } from '@nestjs/common';
import { FinanceModule } from '../finance/finance.module';
import { LeadsModule } from '../leads/leads.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [FinanceModule, LeadsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
