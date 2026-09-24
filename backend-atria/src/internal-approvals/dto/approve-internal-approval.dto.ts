import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ApproveInternalApprovalDto {
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  note?: string;
}
