import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.MASTER, RoleName.ADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getOverview(user.userId);
  }

  @Get('tv-monitoring')
  getTvMonitoring() {
    return this.dashboardService.getTvMonitoring();
  }
}
