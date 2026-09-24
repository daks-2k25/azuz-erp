import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { AnyPermissions } from '../auth/decorators/any-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { getRequiredCalendarEditPermissions } from '../auth/utils/rbac';
import { CalendarService } from './calendar.service';
import {
  CreateEventDto,
  QueryEventsDto,
  UpdateEventDto,
} from './dto/event.dto';

@Controller('calendar')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@AnyPermissions(...getRequiredCalendarEditPermissions())
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('members')
  getTeamMembers() {
    return this.calendarService.getTeamMembers();
  }

  @Get('events')
  getEvents(@Query() query: QueryEventsDto) {
    return this.calendarService.getEvents(query);
  }

  @Post('events')
  createEvent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateEventDto,
  ) {
    return this.calendarService.createEvent(user.userId, dto);
  }

  @Patch('events/:id')
  updateEvent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.calendarService.updateEvent(id, user.userId, user.role, dto);
  }

  @Delete('events/:id')
  deleteEvent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.calendarService.deleteEvent(id, user.userId, user.role);
  }
}
