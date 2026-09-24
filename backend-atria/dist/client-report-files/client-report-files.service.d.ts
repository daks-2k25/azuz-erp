import { PrismaService } from '../prisma/prisma.service';
import { ApproveClientReportFileDto, CreateClientReportFileDto, QueryClientReportFilesDto, UpdateClientReportFileDto } from './dto/client-report-file.dto';
export declare class ClientReportFilesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryClientReportFilesDto): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
        } | null;
        title: string;
        fileUrl: string;
        fileType: string;
        uploadedBy: string;
        status: string;
        approvedAt: string | null;
        approvedBy: string | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
        } | null;
        title: string;
        fileUrl: string;
        fileType: string;
        uploadedBy: string;
        status: string;
        approvedAt: string | null;
        approvedBy: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
    create(dto: CreateClientReportFileDto): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
        } | null;
        title: string;
        fileUrl: string;
        fileType: string;
        uploadedBy: string;
        status: string;
        approvedAt: string | null;
        approvedBy: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: string, dto: UpdateClientReportFileDto): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
        } | null;
        title: string;
        fileUrl: string;
        fileType: string;
        uploadedBy: string;
        status: string;
        approvedAt: string | null;
        approvedBy: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
    approve(id: string, dto: ApproveClientReportFileDto): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
        } | null;
        title: string;
        fileUrl: string;
        fileType: string;
        uploadedBy: string;
        status: string;
        approvedAt: string | null;
        approvedBy: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(id: string): Promise<void>;
    private ensureExists;
    private toResponse;
}
