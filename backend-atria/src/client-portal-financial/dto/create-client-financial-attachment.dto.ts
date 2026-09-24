import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ClientFinancialAttachmentType } from '@prisma/client';

function toUpperEnum({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim().toUpperCase() : value;
}

export class CreateClientFinancialAttachmentDto {
  @Transform(toUpperEnum)
  @IsEnum(ClientFinancialAttachmentType)
  fileType: ClientFinancialAttachmentType;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
