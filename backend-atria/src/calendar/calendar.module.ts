import { Module, forwardRef } from '@nestjs/common';
import { KanbanModule } from '../kanban/kanban.module';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [forwardRef(() => KanbanModule)],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
