import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { AssetsService } from './assets.service';
import { CreateAssetDto, QueryAssetsDto } from './dto/asset.dto';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    findAll(query: QueryAssetsDto): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            avatarUrl: string | null;
            companyName: string;
        };
        fileName: string;
        fileType: "image" | "logo" | "brand_guide" | "document";
        fileUrl: string;
        fileSize: number;
        uploadedBy: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        uploadedAt: string;
    }[]>;
    findGrouped(): Promise<{
        client: {
            id: string;
            avatarUrl: string | null;
            companyName: string;
        };
        assets: ReturnType<any>[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            avatarUrl: string | null;
            companyName: string;
        };
        fileName: string;
        fileType: "image" | "logo" | "brand_guide" | "document";
        fileUrl: string;
        fileSize: number;
        uploadedBy: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        uploadedAt: string;
    }>;
    upload(user: AuthenticatedUser, dto: CreateAssetDto, file: Express.Multer.File): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            avatarUrl: string | null;
            companyName: string;
        };
        fileName: string;
        fileType: "image" | "logo" | "brand_guide" | "document";
        fileUrl: string;
        fileSize: number;
        uploadedBy: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        uploadedAt: string;
    }>;
    remove(id: string): Promise<void>;
}
