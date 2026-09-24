import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { IsEntityId } from '../../common/validation/entity-id';

export class CreateCalendarEntryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year: number;

  @IsEntityId()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  artType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  plannedDate: string;

  @IsEntityId()
  designerId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsEntityId({ optional: true })
  taskId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  productionDeadline?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  storyQuantity?: number;
}

export class UpdateCalendarEntryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  month?: number;

  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @IsOptional()
  year?: number;

  @IsEntityId({ optional: true })
  clientId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  artType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  plannedDate?: string;

  @IsEntityId({ optional: true })
  designerId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsEntityId({ optional: true })
  taskId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  productionDeadline?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  storyQuantity?: number;
}

export class QueryCalendarEntriesDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  year?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  month?: number;

  @IsEntityId({ optional: true })
  clientId?: string;
}
