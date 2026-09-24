import { PrismaService } from '../prisma/prisma.service';
import { CreateSuggestionDto, UpdateSuggestionStatusDto } from './dto/suggestion.dto';
export declare class SuggestionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, companyId: string | null, dto: CreateSuggestionDto): Promise<{
        id: string;
        type: string;
        title: string;
        description: string;
        status: string;
        submittedById: string;
        submittedBy: {
            id: string;
            name: string;
            email: string;
        };
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }>;
    findMine(userId: string, companyId: string | null): Promise<{
        id: string;
        type: string;
        title: string;
        description: string;
        status: string;
        submittedById: string;
        submittedBy: {
            id: string;
            name: string;
            email: string;
        };
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }[]>;
    findAll(companyId: string | null): Promise<{
        id: string;
        type: string;
        title: string;
        description: string;
        status: string;
        submittedById: string;
        submittedBy: {
            id: string;
            name: string;
            email: string;
        };
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }[]>;
    updateStatus(id: string, role: string, companyId: string | null, dto: UpdateSuggestionStatusDto): Promise<{
        id: string;
        type: string;
        title: string;
        description: string;
        status: string;
        submittedById: string;
        submittedBy: {
            id: string;
            name: string;
            email: string;
        };
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }>;
    private assertMasterRole;
    private toResponse;
}
