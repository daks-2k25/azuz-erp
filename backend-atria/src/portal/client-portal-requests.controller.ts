import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { KANBAN_TASK_CREATE_ROLES } from '../auth/constants/roles';
import { ClientRequestsService } from '../client-requests/client-requests.service';
import {
  ConvertClientRequestToTaskDto,
  RejectClientRequestDto,
} from '../client-requests/dto/client-request.dto';

@Controller('client-portal/requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientPortalRequestsController {
  constructor(private readonly clientRequestsService: ClientRequestsService) {}

  @Patch(':id/reject')
  @Roles(RoleName.MASTER, RoleName.ADMIN)
  reject(@Param('id') id: string, @Body() dto: RejectClientRequestDto) {
    return this.clientRequestsService.reject(id, dto);
  }

  @Post(':id/convert-to-task')
  @Roles(...KANBAN_TASK_CREATE_ROLES)
  convertToTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: ConvertClientRequestToTaskDto,
  ) {
    return this.clientRequestsService.convertToTask(id, user.userId, dto);
  }
}
