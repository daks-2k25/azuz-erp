import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateCampaignStatusDto {
  @IsIn(['active', 'paused'])
  @IsNotEmpty()
  status: 'active' | 'paused';
}
