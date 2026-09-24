import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectClientDeliverableDto {
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  reason?: string;
}
