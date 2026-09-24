import { type WorkSchedule, type WorkScheduleDay } from '../domain/work-schedule';
import { WorkScheduleRepository } from './ports/work-schedule.repository';
export interface CreateWorkScheduleInput {
    name: string;
    reminderToleranceMinutes?: number;
    days: WorkScheduleDay[];
}
export interface UpdateWorkScheduleInput {
    name?: string;
    reminderToleranceMinutes?: number;
    days?: WorkScheduleDay[];
}
export declare class WorkSchedulesService {
    private readonly workSchedules;
    constructor(workSchedules: WorkScheduleRepository);
    list(companyId: string): Promise<WorkSchedule[]>;
    getById(companyId: string, workScheduleId: string): Promise<WorkSchedule>;
    getActiveById(companyId: string, workScheduleId: string): Promise<WorkSchedule>;
    create(companyId: string, input: CreateWorkScheduleInput): Promise<WorkSchedule>;
    update(companyId: string, workScheduleId: string, input: UpdateWorkScheduleInput): Promise<WorkSchedule>;
    deactivate(companyId: string, workScheduleId: string): Promise<WorkSchedule>;
    activate(companyId: string, workScheduleId: string): Promise<WorkSchedule>;
    private validateRules;
    private ensureNameIsAvailable;
}
