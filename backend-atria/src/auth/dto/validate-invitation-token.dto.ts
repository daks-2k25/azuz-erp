import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateInvitationTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
