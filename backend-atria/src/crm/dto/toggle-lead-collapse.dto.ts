import { IsBoolean, IsOptional } from 'class-validator';

export class ToggleLeadCollapseDto {
  @IsOptional()
  @IsBoolean()
  isMinimized?: boolean;
}
