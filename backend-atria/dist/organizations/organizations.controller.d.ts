import { UpdateOrganizationCrmStatusDto } from './dto/update-crm-status.dto';
import { UpdateOrganizationSdrAssignmentsDto } from './dto/update-sdr-assignments.dto';
import { OrganizationsService } from './organizations.service';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    getOrganization(id: string): Promise<{
        sdrAssignments: {
            id: string;
            userId: string;
            name: string;
            email: string;
            createdAt: string;
        }[];
        id: string;
        companyName: string;
        isActive: boolean;
        hasCrmEnabled: boolean;
    }>;
    updateCrmStatus(id: string, dto: UpdateOrganizationCrmStatusDto): Promise<{
        id: string;
        companyName: string;
        isActive: boolean;
        hasCrmEnabled: boolean;
    }>;
    replaceSdrAssignments(id: string, dto: UpdateOrganizationSdrAssignmentsDto): Promise<{
        sdrAssignments: {
            id: string;
            userId: string;
            name: string;
            email: string;
            createdAt: string;
        }[];
        id: string;
        companyName: string;
        isActive: boolean;
        hasCrmEnabled: boolean;
    }>;
}
