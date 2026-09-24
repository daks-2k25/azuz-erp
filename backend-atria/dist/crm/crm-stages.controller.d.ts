import { CreateLeadStageDto, ReorderLeadStagesDto, UpdateLeadStageDto } from '../leads/dto/lead-stage.dto';
import { LeadStagesService } from '../leads/lead-stages.service';
export declare class CrmStagesController {
    private readonly leadStagesService;
    constructor(leadStagesService: LeadStagesService);
    findAll(): Promise<{
        id: string;
        tenantId: string;
        companyId: string;
        name: string;
        order: number;
        color: string;
        key: string | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
    create(dto: CreateLeadStageDto): Promise<{
        id: string;
        tenantId: string;
        companyId: string;
        name: string;
        order: number;
        color: string;
        key: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
    reorder(dto: ReorderLeadStagesDto): Promise<{
        id: string;
        tenantId: string;
        companyId: string;
        name: string;
        order: number;
        color: string;
        key: string | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
    update(id: string, dto: UpdateLeadStageDto): Promise<{
        id: string;
        tenantId: string;
        companyId: string;
        name: string;
        order: number;
        color: string;
        key: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
