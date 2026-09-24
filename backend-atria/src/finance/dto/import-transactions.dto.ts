import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { TransactionStatus, TransactionType } from '@prisma/client';

export class ImportTransactionItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  categoryName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsDateString()
  date: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  companyName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  managerName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  serviceName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  reference?: string;
}

export class BulkImportTransactionsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ImportTransactionItemDto)
  transactions: ImportTransactionItemDto[];
}
