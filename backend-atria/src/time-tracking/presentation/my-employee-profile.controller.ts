import { Controller, Get, UseGuards } from '@nestjs/common';
import { AllowAuthenticated } from '../../auth/decorators/allow-authenticated.decorator';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmployeeProfilesService } from '../application/employee-profiles.service';
import { toEmployeeProfileResponse } from './time-tracking.mappers';

/** Endpoints do próprio usuário logado (ex.: saber se ele bate ponto). */
@Controller('time-tracking/me')
@UseGuards(JwtAuthGuard)
@AllowAuthenticated()
export class MyEmployeeProfileController {
  constructor(private readonly employeeProfiles: EmployeeProfilesService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    const profile = await this.employeeProfiles.findForUser(user.userId);
    return { profile: profile ? toEmployeeProfileResponse(profile) : null };
  }
}
