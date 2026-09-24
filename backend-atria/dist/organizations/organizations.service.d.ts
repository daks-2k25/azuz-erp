import { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CrmScopeService } from '../leads/crm-scope.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class OrganizationsService {
    private readonly prisma;
    private readonly crmScope;
    constructor(prisma: PrismaService, crmScope: CrmScopeService);
    updateCrmStatus(id: string, hasCrmEnabled: boolean): Promise<{
        id: string;
        companyName: string;
        isActive: boolean;
        hasCrmEnabled: boolean;
    }>;
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
    replaceSdrAssignments(id: string, sdrUserIds: string[]): Promise<{
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
    listAssignedOrganizations(user: AuthenticatedUser): Promise<import("../leads/crm-scope.service").AssignedOrganizationResponse[]>;
    private ensureOrganizationExists;
    private toOrganizationResponse;
}
