import { type AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { EmployeeProfilesService } from '../application/employee-profiles.service';
import { CreateEmployeeProfileDto, UpdateEmployeeProfileDto } from './dto/employee-profile.dto';
export declare class EmployeeProfilesController {
    private readonly employeeProfiles;
    constructor(employeeProfiles: EmployeeProfilesService);
    list(user: AuthenticatedUser): Promise<{
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
    }[]>;
    create(user: AuthenticatedUser, dto: CreateEmployeeProfileDto): Promise<{
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
    }>;
    update(user: AuthenticatedUser, employeeProfileId: string, dto: UpdateEmployeeProfileDto): Promise<{
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
    }>;
    deactivate(user: AuthenticatedUser, employeeProfileId: string): Promise<{
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
    }>;
    activate(user: AuthenticatedUser, employeeProfileId: string): Promise<{
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
    }>;
}
