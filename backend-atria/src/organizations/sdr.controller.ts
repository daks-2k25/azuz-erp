import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OrganizationsService } from './organizations.service';

@Controller('sdr')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.MASTER, RoleName.ADMIN, RoleName.CRM)
export class SdrController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('assigned-organizations')
  listAssignedOrganizations(@CurrentUser() user: AuthenticatedUser) {
    return this.organizationsService.listAssignedOrganizations(user);
  }
}
