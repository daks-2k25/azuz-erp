import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';
import { MetaInsightsService } from './meta-insights.service';

@Controller('insights')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.MASTER, RoleName.ADMIN)
export class MetaInsightsController {
  constructor(private readonly metaInsightsService: MetaInsightsService) {}

  @Get('overview')
  getOverview() {
    return this.metaInsightsService.getOverview();
  }

  @Get('performance')
  getPerformance() {
    return this.metaInsightsService.getPerformanceChart();
  }

  @Get('campaigns')
  getCampaigns() {
    return this.metaInsightsService.getCampaigns();
  }

  @Patch('campaigns/:id')
  updateCampaign(
    @Param('id') id: string,
    @Body() dto: UpdateCampaignStatusDto,
  ) {
    return this.metaInsightsService.updateCampaignStatus(id, dto.status);
  }
}
