import type { EmployeeProfileWithDetails } from '../../domain/employee-profile';
export interface CreateEmployeeProfileData {
    companyId: string;
    userId: string;
    admissionDate: Date;
    workScheduleId: string;
}
export interface UpdateEmployeeProfileData {
    admissionDate?: Date;
    workScheduleId?: string;
    isActive?: boolean;
}
export interface EligibleUser {
    id: string;
    companyId: string;
    isActive: boolean;
    isInternalMember: boolean;
}
export declare abstract class EmployeeProfileRepository {
    abstract listByCompany(companyId: string): Promise<EmployeeProfileWithDetails[]>;
    abstract findById(companyId: string, employeeProfileId: string): Promise<EmployeeProfileWithDetails | null>;
    abstract findByUserId(userId: string): Promise<EmployeeProfileWithDetails | null>;
    abstract findEligibleUser(userId: string): Promise<EligibleUser | null>;
    abstract create(data: CreateEmployeeProfileData): Promise<EmployeeProfileWithDetails>;
    abstract update(employeeProfileId: string, data: UpdateEmployeeProfileData): Promise<EmployeeProfileWithDetails>;
}
