import { IsOptional, Matches } from 'class-validator';
import { IsEntityId } from '../../../common/validation/entity-id';

const ISO_DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const ISO_DATE_MESSAGE = 'admissionDate: use o formato AAAA-MM-DD.';

export class CreateEmployeeProfileDto {
  @IsEntityId()
  userId: string;

  @Matches(ISO_DATE_PATTERN, { message: ISO_DATE_MESSAGE })
  admissionDate: string;

  @IsEntityId()
  workScheduleId: string;
}

export class UpdateEmployeeProfileDto {
  @IsOptional()
  @Matches(ISO_DATE_PATTERN, { message: ISO_DATE_MESSAGE })
  admissionDate?: string;

  @IsEntityId({ optional: true })
  workScheduleId?: string;
}
