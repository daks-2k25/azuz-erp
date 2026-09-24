import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { DeliverableItemStatus } from '@prisma/client';

function toUpperEnum({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim().toUpperCase() : value;
}

export class RevisionDeliverableItemDto {
  @Transform(toUpperEnum)
  @IsEnum(DeliverableItemStatus)
  status: DeliverableItemStatus;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  adjustmentNotes?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  feedbackNotes?: string | null;
}
