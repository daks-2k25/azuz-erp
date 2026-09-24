import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateClientGroupDto } from './client-group.dto';

export class BulkImportClientGroupsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClientGroupDto)
  groups: CreateClientGroupDto[];
}
