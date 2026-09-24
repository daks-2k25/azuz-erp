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
import { EmployeeProfilesService } from '../application/employee-profiles.service';
import {
  CreateEmployeeProfileDto,
  UpdateEmployeeProfileDto,
} from './dto/employee-profile.dto';
import {
  parseCalendarDate,
  toEmployeeProfileResponse,
} from './time-tracking.mappers';

@Controller('time-tracking/employees')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions(Permission.TIMECLOCK_MANAGE)
export class EmployeeProfilesController {
  constructor(private readonly employeeProfiles: EmployeeProfilesService) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser) {
    const profiles = await this.employeeProfiles.list(
      resolveCompanyId(user.companyId),
    );
    return profiles.map(toEmployeeProfileResponse);
  }

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateEmployeeProfileDto,
  ) {
    const profile = await this.employeeProfiles.create(
      resolveCompanyId(user.companyId),
      {
        userId: dto.userId,
        admissionDate: parseCalendarDate(dto.admissionDate),
        workScheduleId: dto.workScheduleId,
      },
    );
    return toEmployeeProfileResponse(profile);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') employeeProfileId: string,
    @Body() dto: UpdateEmployeeProfileDto,
  ) {
    const profile = await this.employeeProfiles.update(
      resolveCompanyId(user.companyId),
      employeeProfileId,
      {
        admissionDate: dto.admissionDate
          ? parseCalendarDate(dto.admissionDate)
          : undefined,
        workScheduleId: dto.workScheduleId,
      },
    );
    return toEmployeeProfileResponse(profile);
  }

  @Patch(':id/deactivate')
  async deactivate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') employeeProfileId: string,
  ) {
    const profile = await this.employeeProfiles.deactivate(
      resolveCompanyId(user.companyId),
      employeeProfileId,
    );
    return toEmployeeProfileResponse(profile);
  }

  @Patch(':id/activate')
  async activate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') employeeProfileId: string,
  ) {
    const profile = await this.employeeProfiles.activate(
      resolveCompanyId(user.companyId),
      employeeProfileId,
    );
    return toEmployeeProfileResponse(profile);
  }
}
