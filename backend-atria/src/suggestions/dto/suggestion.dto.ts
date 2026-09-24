import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SystemSuggestionStatus, SystemSuggestionType } from '@prisma/client';

export class CreateSuggestionDto {
  @IsEnum(SystemSuggestionType)
  type: SystemSuggestionType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;
}

export class UpdateSuggestionStatusDto {
  @IsEnum(SystemSuggestionStatus)
  status: SystemSuggestionStatus;
}
