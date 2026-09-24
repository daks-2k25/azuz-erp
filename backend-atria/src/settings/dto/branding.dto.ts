import {
  IsHexColor,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateBrandingDto {
  @IsString()
  @IsOptional()
  @MaxLength(120)
  agencyName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  logoUrl?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  faviconUrl?: string | null;

  @IsHexColor()
  @IsOptional()
  primaryColor?: string;

  @IsHexColor()
  @IsOptional()
  accentColor?: string;
}
