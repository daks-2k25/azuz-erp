import { type AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { EmployeeProfilesService } from '../application/employee-profiles.service';
export declare class MyEmployeeProfileController {
    private readonly employeeProfiles;
    constructor(employeeProfiles: EmployeeProfilesService);
    getProfile(user: AuthenticatedUser): Promise<{
        profile: {
            id: string;
            userId: string;
            user: {
                id: string;
                name: string;
                email: string;
                avatarUrl: string | null;
            };
            employmentType: "CLT";
            admissionDate: string;
            workSchedule: {
                id: string;
                name: string;
            };
            isActive: boolean;
        } | null;
    }>;
}
