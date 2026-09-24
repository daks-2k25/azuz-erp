import { IsEntityId } from '../../common/validation/entity-id';

export class ProspectingLeadsQueryDto {
  @IsEntityId({ optional: true })
  organizationId?: string;
}
