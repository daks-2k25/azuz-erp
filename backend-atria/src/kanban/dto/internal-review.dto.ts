import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum InternalReviewAction {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class InternalReviewDto {
  @IsEnum(InternalReviewAction)
  status: InternalReviewAction;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  note?: string;
}
