import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLeadCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;
}
