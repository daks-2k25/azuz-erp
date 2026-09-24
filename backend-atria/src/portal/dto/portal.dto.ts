import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PortalRejectPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  rejectionReason: string;
}

export class PortalBriefingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;
}
