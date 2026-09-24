import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  ContentPlatform,
  ContentPostFormat,
} from '@prisma/client';
import { IsEntityId } from '../../common/validation/entity-id';

export class GenerateBriefPlanDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  brief: string;

  @IsEntityId()
  clientId: string;

  @IsEnum(ContentPlatform)
  @IsOptional()
  platform?: ContentPlatform;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  objective?: string;
}

export class BriefPlanIdeaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  copy: string;

  @IsEnum(ContentPostFormat)
  format: ContentPostFormat;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  mediaConcept: string;

  @IsString()
  @IsNotEmpty()
  suggestedDate: string;
}

export class CreateBriefPlanDto {
  @IsEntityId()
  clientId: string;

  @IsEnum(ContentPlatform)
  platform: ContentPlatform;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BriefPlanIdeaDto)
  ideas: BriefPlanIdeaDto[];

  @IsOptional()
  createKanbanTasks?: boolean;
}
