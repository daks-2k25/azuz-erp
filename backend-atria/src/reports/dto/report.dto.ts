import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { IsEntityId } from '../../common/validation/entity-id';

export class GenerateReportDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @Type(() => Number)
  @IsInt()
  @Min(2020)
  @Max(2100)
  year: number;
}

export class QueryReportsDto {
  @IsEntityId({ optional: true })
  clientId?: string;

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
}
