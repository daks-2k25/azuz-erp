import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;
}

export class UpdateColumnDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;
}

export class ReorderColumnItemDto {
  @IsUUID()
  id: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderColumnsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderColumnItemDto)
  items: ReorderColumnItemDto[];
}
