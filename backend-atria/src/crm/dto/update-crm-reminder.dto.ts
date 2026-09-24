import { CrmReminderTaskStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ToUpperEnum } from '../../common/validation/entity-id';

export class UpdateCrmReminderDto {
  @ToUpperEnum()
  @IsEnum(CrmReminderTaskStatus)
  status: CrmReminderTaskStatus;
}
