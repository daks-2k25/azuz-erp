import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { DeliverableApprovalStatus } from '@prisma/client';

export enum ClientPortalDeliverableStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REQUIRES_ADJUSTMENT = 'REQUIRES_ADJUSTMENT',
}

function toUpperEnum({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim().toUpperCase() : value;
}

export function mapClientPortalDeliverableStatus(
  status: ClientPortalDeliverableStatus,
): DeliverableApprovalStatus {
  switch (status) {
    case ClientPortalDeliverableStatus.APPROVED:
      return DeliverableApprovalStatus.APPROVED;
    case ClientPortalDeliverableStatus.REJECTED:
    case ClientPortalDeliverableStatus.REQUIRES_ADJUSTMENT:
      return DeliverableApprovalStatus.REQUIRES_ADJUSTMENT;
    default:
      return DeliverableApprovalStatus.REQUIRES_ADJUSTMENT;
  }
}

export class QueryClientDeliverablesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  @Transform(toUpperEnum)
  @IsEnum(ClientPortalDeliverableStatus)
  @IsOptional()
  status?: ClientPortalDeliverableStatus;
}
