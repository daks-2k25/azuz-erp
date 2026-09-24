import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LeadSearchDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  bairro: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  categoria: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    cidade: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  countryCode: string;
  }
