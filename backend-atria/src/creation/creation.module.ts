import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { CalendarModule } from '../calendar/calendar.module';
import { ContentModule } from '../content/content.module';
import { KanbanModule } from '../kanban/kanban.module';
import { CreationController } from './creation.controller';
import { CreationService } from './creation.service';

@Module({
  imports: [AiModule, ContentModule, KanbanModule, CalendarModule],
  controllers: [CreationController],
  providers: [CreationService],
})
export class CreationModule {}
