import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsEntityId } from '../../common/validation/entity-id';

export class CreateClientReportFileDto {
  @IsEntityId()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fileType: string;

  @IsEntityId()
  uploadedBy: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;
}

export class UpdateClientReportFileDto {
  @IsEntityId({ optional: true })
  clientId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  fileUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  fileType?: string;

  @IsEntityId({ optional: true })
  uploadedBy?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;
}

export class QueryClientReportFilesDto {
  @IsEntityId({ optional: true })
  clientId?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class ApproveClientReportFileDto {
  @IsEntityId()
  approvedBy: string;
}
