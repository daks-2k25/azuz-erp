import { Module } from '@nestjs/common';
import { MetaInsightsModule } from '../meta-insights/meta-insights.module';
import { PortalModule } from '../portal/portal.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [MetaInsightsModule, PortalModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
