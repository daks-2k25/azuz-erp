import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  ClientRequestContentType,
  ClientRequestStatus,
  KanbanTaskPriority,
} from '@prisma/client';
import { IsEntityId } from '../../common/validation/entity-id';

function toUpperEnum({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim().toUpperCase() : value;
}

function toContentTypeEnum({ value }: { value: unknown }) {
  if (typeof value !== 'string') return value;
  const normalized = value.trim().toUpperCase();
  const legacyMap: Record<string, ClientRequestContentType> = {
    POST: ClientRequestContentType.REDE_SOCIAL,
    POST_ESTATICO: ClientRequestContentType.REDE_SOCIAL,
    STATIC: ClientRequestContentType.REDE_SOCIAL,
    REELS: ClientRequestContentType.REDE_SOCIAL,
    CARROSSEL: ClientRequestContentType.REDE_SOCIAL,
    CAROUSEL: ClientRequestContentType.REDE_SOCIAL,
    STORIES: ClientRequestContentType.REDE_SOCIAL,
    STORY: ClientRequestContentType.REDE_SOCIAL,
  };
  return legacyMap[normalized] ?? normalized;
}

export class CreateClientRequestDto {
  @IsEntityId({ optional: true })
  clientId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
  description?: string;

  @Transform(toContentTypeEnum)
  @IsEnum(ClientRequestContentType)
  @IsOptional()
  contentType?: ClientRequestContentType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  referenceLinks?: string[];

  @IsOptional()
  attachments?: unknown;

  @Transform(toUpperEnum)
  @IsEnum(ClientRequestStatus)
  @IsOptional()
  status?: ClientRequestStatus;

  @IsEntityId({ optional: true })
  relatedTaskId?: string;
}

export class UpdateClientRequestDto {
  @IsEntityId({ optional: true })
  clientId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
  description?: string;

  @Transform(toContentTypeEnum)
  @IsEnum(ClientRequestContentType)
  @IsOptional()
  contentType?: ClientRequestContentType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  referenceLinks?: string[];

  @IsOptional()
  attachments?: unknown;

  @Transform(toUpperEnum)
  @IsEnum(ClientRequestStatus)
  @IsOptional()
  status?: ClientRequestStatus;

  @IsEntityId({ optional: true })
  relatedTaskId?: string;
}

export class QueryClientRequestsDto {
  @IsEntityId({ optional: true })
  clientId?: string;

  @Transform(toUpperEnum)
  @IsEnum(ClientRequestStatus)
  @IsOptional()
  status?: ClientRequestStatus;

  @Transform(toContentTypeEnum)
  @IsEnum(ClientRequestContentType)
  @IsOptional()
  contentType?: ClientRequestContentType;
}

export class CreateClientRequestCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  body: string;

  @IsEntityId({ optional: true })
  parentId?: string;
}

export class RejectClientRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  rejectionReason: string;
}

export class ConvertClientRequestToTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @IsEntityId({ optional: true })
  columnId?: string;

  @Transform(toUpperEnum)
  @IsEnum(KanbanTaskPriority)
  @IsOptional()
  priority?: KanbanTaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  @IsDateString()
  @IsOptional()
  publicationDate?: string;

  @IsEntityId({ optional: true })
  assigneeId?: string;

  @IsOptional()
  @IsArray()
  @IsEntityId({ each: true })
  assigneeIds?: string[];

  @IsEntityId({ optional: true })
  assignedGroupId?: string;
}
