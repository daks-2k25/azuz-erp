import { PrismaService } from '../prisma/prisma.service';
import { SupabaseStorageService } from '../supabase/supabase-storage.service';
import { CreateClientFinancialAttachmentDto } from './dto/create-client-financial-attachment.dto';
export declare class ClientPortalFinancialService {
    private readonly prisma;
    private readonly storage;
    constructor(prisma: PrismaService, storage: SupabaseStorageService);
    listForClient(clientId: string): Promise<{
        id: string;
        clientId: string;
        organizationId: string;
        fileUrl: string;
        fileType: "invoice" | "receipt";
        description: string | null;
        uploadedAt: string;
    }[]>;
    uploadForClient(clientId: string, dto: CreateClientFinancialAttachmentDto, file: Express.Multer.File): Promise<{
        id: string;
        clientId: string;
        organizationId: string;
        fileUrl: string;
        fileType: "invoice" | "receipt";
        description: string | null;
        uploadedAt: string;
    }>;
    private toResponse;
}
