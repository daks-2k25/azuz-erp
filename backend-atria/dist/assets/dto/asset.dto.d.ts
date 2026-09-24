import { AssetFileType } from '@prisma/client';
export declare class QueryAssetsDto {
    clientId?: string;
    fileType?: AssetFileType;
}
export declare class CreateAssetDto {
    clientId: string;
    fileType: AssetFileType;
}
