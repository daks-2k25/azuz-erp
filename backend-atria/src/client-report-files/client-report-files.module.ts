import { Module } from '@nestjs/common';
import { ClientReportFilesController } from './client-report-files.controller';
import { ClientReportFilesService } from './client-report-files.service';

@Module({
  controllers: [ClientReportFilesController],
  providers: [ClientReportFilesService],
  exports: [ClientReportFilesService],
})
export class ClientReportFilesModule {}
