import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  roleName?: 'MASTER' | 'ADMIN' | 'DESIGNER_MASTER' | 'DESIGNER_JUNIOR' | 'CRM' | 'EXTERNAL_CLIENT_CRM' | 'CLIENT';
}
