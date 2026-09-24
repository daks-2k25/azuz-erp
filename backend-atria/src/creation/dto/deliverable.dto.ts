import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { IsEntityId } from '../../common/validation/entity-id';

export enum CreationDeliverableType {
  POST_INSTAGRAM = 'post_instagram',
  POST_REELS = 'post_reels',
  POST_CAROUSEL = 'post_carousel',
  POST_STATIC = 'post_static',
  POST_STORY = 'post_story',
  MEETING = 'reuniao',
  DELIVERY = 'entrega',
}

export enum CreationDeliverableStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
}

export class CreateDeliverableDto {
  @IsEntityId()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsEnum(CreationDeliverableType)
  type: CreationDeliverableType;

  @IsDateString()
  scheduledAt: string;

  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  @IsOptional()
  referenceUrl?: string;

  @IsEnum(CreationDeliverableStatus)
  status: CreationDeliverableStatus;
}

export class QueryClientPipelineDto {
  // Legacy seeded clients use non-UUID ids (e.g. "client-1775...").
  @IsEntityId()
  clientId: string;

  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}

export class UpdateItemStatusDto {
  @IsEnum(CreationDeliverableStatus)
  status: CreationDeliverableStatus;
}
