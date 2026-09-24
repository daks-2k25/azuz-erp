import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostVersionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  copyText: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @MaxLength(2000, { each: true })
  mediaUrls?: string[];
}

export class RejectContentPostDto {
  @IsString()
  @IsNotEmpty({ message: 'rejectionReason cannot be blank or whitespace-only' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(5000)
  rejectionReason: string;
}
