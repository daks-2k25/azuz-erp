import { PrismaService } from '../../prisma/prisma.service';
import type { EmployeeProfileWithDetails } from '../domain/employee-profile';
import { CreateEmployeeProfileData, EligibleUser, EmployeeProfileRepository, UpdateEmployeeProfileData } from '../application/ports/employee-profile.repository';
export declare class PrismaEmployeeProfileRepository extends EmployeeProfileRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCompany(companyId: string): Promise<EmployeeProfileWithDetails[]>;
    findById(companyId: string, employeeProfileId: string): Promise<EmployeeProfileWithDetails | null>;
    findByUserId(userId: string): Promise<EmployeeProfileWithDetails | null>;
    findEligibleUser(userId: string): Promise<EligibleUser | null>;
    create(data: CreateEmployeeProfileData): Promise<EmployeeProfileWithDetails>;
    update(employeeProfileId: string, data: UpdateEmployeeProfileData): Promise<EmployeeProfileWithDetails>;
}
