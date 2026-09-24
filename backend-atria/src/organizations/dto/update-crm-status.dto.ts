import { IsBoolean } from 'class-validator';

export class UpdateOrganizationCrmStatusDto {
  @IsBoolean()
  hasCrmEnabled: boolean;
}
