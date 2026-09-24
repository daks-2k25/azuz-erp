import type { WorkSchedule, WorkScheduleDay } from '../../domain/work-schedule';
export interface CreateWorkScheduleData {
    companyId: string;
    name: string;
    reminderToleranceMinutes: number;
    days: WorkScheduleDay[];
}
export interface UpdateWorkScheduleData {
    name?: string;
    reminderToleranceMinutes?: number;
    isActive?: boolean;
    days?: WorkScheduleDay[];
}
export declare abstract class WorkScheduleRepository {
    abstract listByCompany(companyId: string): Promise<WorkSchedule[]>;
    abstract findById(companyId: string, workScheduleId: string): Promise<WorkSchedule | null>;
    abstract existsWithName(companyId: string, name: string, ignoreWorkScheduleId?: string): Promise<boolean>;
    abstract countActiveEmployees(workScheduleId: string): Promise<number>;
    abstract create(data: CreateWorkScheduleData): Promise<WorkSchedule>;
    abstract update(workScheduleId: string, data: UpdateWorkScheduleData): Promise<WorkSchedule>;
}
