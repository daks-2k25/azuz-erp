import { PrismaService } from '../../prisma/prisma.service';
import type { WorkSchedule } from '../domain/work-schedule';
import { CreateWorkScheduleData, UpdateWorkScheduleData, WorkScheduleRepository } from '../application/ports/work-schedule.repository';
export declare class PrismaWorkScheduleRepository extends WorkScheduleRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCompany(companyId: string): Promise<WorkSchedule[]>;
    findById(companyId: string, workScheduleId: string): Promise<WorkSchedule | null>;
    existsWithName(companyId: string, name: string, ignoreWorkScheduleId?: string): Promise<boolean>;
    countActiveEmployees(workScheduleId: string): Promise<number>;
    create(data: CreateWorkScheduleData): Promise<WorkSchedule>;
    update(workScheduleId: string, data: UpdateWorkScheduleData): Promise<WorkSchedule>;
}
