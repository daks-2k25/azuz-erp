import { Module } from '@nestjs/common';
import { CompanySettingsModule } from '../../company-settings/company-settings.module';
import { MetaAnalyticsController } from './meta-analytics.controller';
import { MetaAnalyticsService } from './meta-analytics.service';

@Module({
  imports: [CompanySettingsModule],
  controllers: [MetaAnalyticsController],
  providers: [MetaAnalyticsService],
  exports: [MetaAnalyticsService],
})
export class MetaAnalyticsModule {}
