import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateArtTypePricingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  artType: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerPiece: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}

export class UpdateArtTypePricingDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  artType?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  pricePerPiece?: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
