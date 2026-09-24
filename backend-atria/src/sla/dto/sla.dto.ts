import {
  IsInt,
  IsOptional,
  IsEnum,
  IsUUID,
  Min,
} from 'class-validator';
import { ClientBriefStatus, KanbanTaskPriority } from '@prisma/client';

export class UpdateSlaSettingsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  slaResponseCriticalHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  slaResponseHighHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  slaResponseMediumHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  slaResponseLowHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  slaResponsePlannedHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  slaResolutionCriticalHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  slaResolutionHighHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  slaResolutionMediumHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  slaResolutionLowHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  slaResolutionPlannedHours?: number;
}

export class UpdateClientBriefSlaDto {
  @IsOptional()
  @IsEnum(ClientBriefStatus)
  status?: ClientBriefStatus;

  @IsOptional()
  @IsEnum(KanbanTaskPriority)
  priority?: KanbanTaskPriority;

  @IsOptional()
  @IsUUID()
  assignedToId?: string | null;
}
