import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { CompanyStatus } from '@prisma/client';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(63)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  subdomain: string;
}

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  @MaxLength(120)
  name?: string;

  @IsEnum(CompanyStatus)
  @IsOptional()
  status?: CompanyStatus;
}
