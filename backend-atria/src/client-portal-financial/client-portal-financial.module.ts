import { Module } from '@nestjs/common';
import { ClientPortalFinancialController } from './client-portal-financial.controller';
import { ClientPortalFinancialService } from './client-portal-financial.service';

@Module({
  controllers: [ClientPortalFinancialController],
  providers: [ClientPortalFinancialService],
  exports: [ClientPortalFinancialService],
})
export class ClientPortalFinancialModule {}
