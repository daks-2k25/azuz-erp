import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { OrganizationsService } from './organizations.service';
export declare class SdrController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    listAssignedOrganizations(user: AuthenticatedUser): Promise<import("../leads/crm-scope.service").AssignedOrganizationResponse[]>;
}
