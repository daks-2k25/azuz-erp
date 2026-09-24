import { RoleName } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreateInvitationTokenDto {
  @IsEnum(RoleName)
  role: RoleName;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  expiresInDays?: number;
}
