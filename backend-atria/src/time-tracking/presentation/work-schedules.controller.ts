import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Permission } from '../../auth/constants/permissions';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../auth/decorators/current-user.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { resolveCompanyId } from '../application/company-scope';
import { WorkSchedulesService } from '../application/work-schedules.service';
import {
  CreateWorkScheduleDto,
  UpdateWorkScheduleDto,
} from './dto/work-schedule.dto';
import {
  toWorkScheduleDays,
  toWorkScheduleResponse,
} from './time-tracking.mappers';

@Controller('time-tracking/work-schedules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions(Permission.TIMECLOCK_MANAGE)
export class WorkSchedulesController {
  constructor(private readonly workSchedules: WorkSchedulesService) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser) {
    const schedules = await this.workSchedules.list(
      resolveCompanyId(user.companyId),
    );
    return schedules.map(toWorkScheduleResponse);
  }

  @Get(':id')
  async getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') workScheduleId: string,
  ) {
    const schedule = await this.workSchedules.getById(
      resolveCompanyId(user.companyId),
      workScheduleId,
    );
    return toWorkScheduleResponse(schedule);
  }

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkScheduleDto,
  ) {
    const schedule = await this.workSchedules.create(
      resolveCompanyId(user.companyId),
      {
        name: dto.name,
        reminderToleranceMinutes: dto.reminderToleranceMinutes,
        days: toWorkScheduleDays(dto.days),
      },
    );
    return toWorkScheduleResponse(schedule);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') workScheduleId: string,
    @Body() dto: UpdateWorkScheduleDto,
  ) {
    const schedule = await this.workSchedules.update(
      resolveCompanyId(user.companyId),
      workScheduleId,
      {
        name: dto.name,
        reminderToleranceMinutes: dto.reminderToleranceMinutes,
        days: dto.days ? toWorkScheduleDays(dto.days) : undefined,
      },
    );
    return toWorkScheduleResponse(schedule);
  }

  @Patch(':id/deactivate')
  async deactivate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') workScheduleId: string,
  ) {
    const schedule = await this.workSchedules.deactivate(
      resolveCompanyId(user.companyId),
      workScheduleId,
    );
    return toWorkScheduleResponse(schedule);
  }

  @Patch(':id/activate')
  async activate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') workScheduleId: string,
  ) {
    const schedule = await this.workSchedules.activate(
      resolveCompanyId(user.companyId),
      workScheduleId,
    );
    return toWorkScheduleResponse(schedule);
  }
}
