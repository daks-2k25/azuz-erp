import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCompanySettingsDto {
  @IsBoolean()
  @IsOptional()
  hasCrmModuleEnabled?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  metaAdAccountId?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  metaPageAccessToken?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  metaAppId?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  metaAppSecret?: string | null;
}
