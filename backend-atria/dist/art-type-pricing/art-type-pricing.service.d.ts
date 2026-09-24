import { PrismaService } from '../prisma/prisma.service';
import { CreateArtTypePricingDto, UpdateArtTypePricingDto } from './dto/art-type-pricing.dto';
export declare class ArtTypePricingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        artType: string;
        pricePerPiece: number;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        artType: string;
        pricePerPiece: number;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
    create(dto: CreateArtTypePricingDto): Promise<{
        id: string;
        artType: string;
        pricePerPiece: number;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: string, dto: UpdateArtTypePricingDto): Promise<{
        id: string;
        artType: string;
        pricePerPiece: number;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(id: string): Promise<void>;
    private ensureExists;
    private toResponse;
    private isUniqueConstraintError;
}
