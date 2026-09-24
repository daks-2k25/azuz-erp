import { IsHexColor } from 'class-validator';

export class UpdateAppearanceDto {
  @IsHexColor()
  primaryColor: string;

  @IsHexColor()
  accentColor: string;

  @IsHexColor()
  backgroundColor: string;

  @IsHexColor()
  textColor: string;

  @IsHexColor()
  sidebarColor: string;
}
