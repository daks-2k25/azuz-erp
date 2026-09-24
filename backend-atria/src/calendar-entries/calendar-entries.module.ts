import { Module } from '@nestjs/common';
import { CalendarEntriesController } from './calendar-entries.controller';
import { CalendarEntriesService } from './calendar-entries.service';

@Module({
  controllers: [CalendarEntriesController],
  providers: [CalendarEntriesService],
  exports: [CalendarEntriesService],
})
export class CalendarEntriesModule {}
