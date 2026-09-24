import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { RoleName } from '@prisma/client';

function toUpperRoleArray({ value }: { value: unknown }) {
  if (!Array.isArray(value)) return value;
  return value.map((item) =>
    typeof item === 'string' ? item.toUpperCase() : item,
  );
}

export class CreateAppUpdateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20000)
  body: string;

  @IsArray()
  @ArrayMinSize(1)
  @Transform(toUpperRoleArray)
  @IsEnum(RoleName, { each: true })
  visibleRoles: RoleName[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateAppUpdateDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20000)
  body?: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @Transform(toUpperRoleArray)
  @IsEnum(RoleName, { each: true })
  visibleRoles?: RoleName[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
