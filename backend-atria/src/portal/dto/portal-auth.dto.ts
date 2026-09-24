import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class PortalLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ProvisionPortalAccessDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
