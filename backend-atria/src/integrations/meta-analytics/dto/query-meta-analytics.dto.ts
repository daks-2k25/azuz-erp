import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export const META_DATE_PRESETS = [
  'today',
  'yesterday',
  'last_7d',
  'last_14d',
  'last_28d',
  'last_30d',
  'last_90d',
  'this_month',
  'last_month',
  'this_quarter',
  'this_year',
  'last_year',
  'maximum',
] as const;

export type MetaDatePreset = (typeof META_DATE_PRESETS)[number];

export class QueryMetaAnalyticsDto {
  @IsOptional()
  @IsIn(META_DATE_PRESETS)
  datePreset?: MetaDatePreset;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  adAccountId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2020)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
