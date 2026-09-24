import { IsArray } from 'class-validator';
import { IsEntityId } from '../../common/validation/entity-id';

export class UpdateOrganizationSdrAssignmentsDto {
  @IsArray()
  @IsEntityId({ each: true })
  sdrUserIds: string[];
}
