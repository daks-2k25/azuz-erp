import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateClientDto } from './client.dto';

export class BulkImportClientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClientDto)
  clients: CreateClientDto[];
}
