import { Module } from '@nestjs/common';
import { CompanySettingsModule } from '../company-settings/company-settings.module';
import { LeadsModule } from '../leads/leads.module';
import { LeadMinerController } from './leadminer.controller';
import { LeadminerService } from './leadminer.service';

@Module({
  imports: [CompanySettingsModule, LeadsModule],
  controllers: [LeadMinerController],
  providers: [LeadminerService],
  exports: [LeadminerService],
})
export class LeadMinerModule {}
