import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto, QueryAssetsDto } from './dto/asset.dto';
export declare class AssetsService {
    private readonly prisma;
    private readonly uploadDir;
    constructor(prisma: PrismaService);
    getUploadDir(): string;
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
    findByClientGrouped(): Promise<{
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
    upload(userId: string | null, dto: CreateAssetDto, file: Express.Multer.File): Promise<{
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
    private toResponse;
}
