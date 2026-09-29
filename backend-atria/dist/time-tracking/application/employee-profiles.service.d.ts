import type { EmployeeProfileWithDetails } from '../domain/employee-profile';
import { EmployeeProfileRepository } from './ports/employee-profile.repository';
import { WorkSchedulesService } from './work-schedules.service';
export interface CreateEmployeeProfileInput {
    userId: string;
    admissionDate: Date;
    workScheduleId: string;
}
export interface UpdateEmployeeProfileInput {
    admissionDate?: Date;
    workScheduleId?: string;
}
export declare class EmployeeProfilesService {
    private readonly employeeProfiles;
    private readonly workSchedules;
    constructor(employeeProfiles: EmployeeProfileRepository, workSchedules: WorkSchedulesService);
    list(companyId: string): Promise<EmployeeProfileWithDetails[]>;
    findForUser(userId: string): Promise<EmployeeProfileWithDetails | null>;
    create(companyId: string, input: CreateEmployeeProfileInput): Promise<EmployeeProfileWithDetails>;
    update(companyId: string, employeeProfileId: string, input: UpdateEmployeeProfileInput): Promise<EmployeeProfileWithDetails>;
    deactivate(companyId: string, employeeProfileId: string): Promise<EmployeeProfileWithDetails>;
    activate(companyId: string, employeeProfileId: string): Promise<EmployeeProfileWithDetails>;
    private getById;
    private ensureUserIsEligible;
    private ensureUserHasNoProfile;
}
