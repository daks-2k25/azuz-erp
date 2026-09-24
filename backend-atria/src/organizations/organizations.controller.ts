import { Body, Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { Permission } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateOrganizationCrmStatusDto } from './dto/update-crm-status.dto';
import { UpdateOrganizationSdrAssignmentsDto } from './dto/update-sdr-assignments.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(RoleName.MASTER, RoleName.ADMIN)
@Permissions(Permission.SETTINGS_MANAGE)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get(':id')
  getOrganization(@Param('id') id: string) {
    return this.organizationsService.getOrganization(id);
  }

  @Patch(':id/crm-status')
  updateCrmStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationCrmStatusDto,
  ) {
    return this.organizationsService.updateCrmStatus(id, dto.hasCrmEnabled);
  }

  @Put(':id/sdr-assignments')
  replaceSdrAssignments(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationSdrAssignmentsDto,
  ) {
    return this.organizationsService.replaceSdrAssignments(id, dto.sdrUserIds);
  }
}
