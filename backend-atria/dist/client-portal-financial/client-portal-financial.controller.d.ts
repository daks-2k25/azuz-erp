import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { ClientPortalFinancialService } from './client-portal-financial.service';
import { CreateClientFinancialAttachmentDto } from './dto/create-client-financial-attachment.dto';
export declare class ClientPortalFinancialController {
    private readonly financialService;
    constructor(financialService: ClientPortalFinancialService);
    listAttachments(user: AuthenticatedUser): Promise<{
        id: string;
        clientId: string;
        organizationId: string;
        fileUrl: string;
        fileType: "invoice" | "receipt";
        description: string | null;
        uploadedAt: string;
    }[]>;
    uploadAttachment(user: AuthenticatedUser, file: Express.Multer.File, dto: CreateClientFinancialAttachmentDto): Promise<{
        id: string;
        clientId: string;
        organizationId: string;
        fileUrl: string;
        fileType: "invoice" | "receipt";
        description: string | null;
        uploadedAt: string;
    }>;
    private requireClientId;
}
