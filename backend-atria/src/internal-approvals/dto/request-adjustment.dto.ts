import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RequestAdjustmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  note: string;
}
