import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { EventCategory, KanbanTaskStatus } from '@prisma/client';
import {
  IsEntityId,
  ToUpperEnum,
} from '../../common/validation/entity-id';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;

  @ToUpperEnum()
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;

  @IsBoolean()
  @IsOptional()
  isPending?: boolean;

  @IsEntityId({ optional: true })
  assigneeId?: string;

  @IsEntityId({ optional: true })
  assignedGroupId?: string;

  @IsEntityId({ optional: true })
  clientId?: string;

  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  @IsOptional()
  referenceUrl?: string;

  @IsBoolean()
  @IsOptional()
  createKanbanTask?: boolean;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsDateString()
  @IsOptional()
  startAt?: string;

  @IsDateString()
  @IsOptional()
  endAt?: string;

  @ToUpperEnum()
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;

  @ToUpperEnum()
  @IsEnum(KanbanTaskStatus)
  @IsOptional()
  status?: KanbanTaskStatus;

  @IsBoolean()
  @IsOptional()
  isPending?: boolean;

  @IsEntityId({ optional: true })
  assigneeId?: string | null;

  @IsEntityId({ optional: true })
  assignedGroupId?: string | null;

  @IsEntityId({ optional: true })
  clientId?: string | null;

  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  @IsOptional()
  referenceUrl?: string | null;
}

export class QueryEventsDto {
  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;

  @IsEntityId({ optional: true })
  clientId?: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === '1')
  @IsBoolean()
  includeUnmapped?: boolean;
}
