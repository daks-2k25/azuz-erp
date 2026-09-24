import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FetchMapsLeadsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  category: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  neighborhood: string;
}
