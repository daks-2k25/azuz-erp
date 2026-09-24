import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { AnyPermissions } from '../auth/decorators/any-permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { getRequiredCrmPermissions } from '../auth/utils/rbac';
import {
  CreateLeadStageDto,
  ReorderLeadStagesDto,
  UpdateLeadStageDto,
} from '../leads/dto/lead-stage.dto';
import { LeadStagesService } from '../leads/lead-stages.service';

@Controller('crm/stages')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@AnyPermissions(...getRequiredCrmPermissions())
export class CrmStagesController {
  constructor(private readonly leadStagesService: LeadStagesService) {}

  @Get()
  findAll() {
    return this.leadStagesService.findAll();
  }

  @Post()
  @Roles(RoleName.MASTER, RoleName.ADMIN)
  create(@Body() dto: CreateLeadStageDto) {
    return this.leadStagesService.create(dto);
  }

  @Patch('reorder')
  @Roles(RoleName.MASTER, RoleName.ADMIN)
  reorder(@Body() dto: ReorderLeadStagesDto) {
    return this.leadStagesService.reorder(dto);
  }

  @Patch(':id')
  @Roles(RoleName.MASTER, RoleName.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateLeadStageDto) {
    return this.leadStagesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.MASTER, RoleName.ADMIN)
  remove(@Param('id') id: string) {
    return this.leadStagesService.remove(id);
  }
}
