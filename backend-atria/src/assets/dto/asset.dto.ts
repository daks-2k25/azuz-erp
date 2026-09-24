import { IsEnum, IsOptional } from 'class-validator';
import { AssetFileType } from '@prisma/client';
import { IsEntityId, ToUpperEnum } from '../../common/validation/entity-id';

export class QueryAssetsDto {
  @IsEntityId({ optional: true })
  clientId?: string;

  @IsOptional()
  @ToUpperEnum()
  @IsEnum(AssetFileType)
  fileType?: AssetFileType;
}

export class CreateAssetDto {
  @IsEntityId()
  clientId: string;

  @ToUpperEnum()
  @IsEnum(AssetFileType)
  fileType: AssetFileType;
}
