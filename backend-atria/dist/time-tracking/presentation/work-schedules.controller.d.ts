import { type AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { WorkSchedulesService } from '../application/work-schedules.service';
import { CreateWorkScheduleDto, UpdateWorkScheduleDto } from './dto/work-schedule.dto';
export declare class WorkSchedulesController {
    private readonly workSchedules;
    constructor(workSchedules: WorkSchedulesService);
    list(user: AuthenticatedUser): Promise<{
        id: string;
        name: string;
        reminderToleranceMinutes: number;
        isActive: boolean;
        weeklyWorkMinutes: number;
        days: {
            weekday: import("../domain/work-schedule").IsoWeekday;
            weekdayLabel: string;
            start: string;
            breakStart: string;
            breakEnd: string;
            end: string;
            workMinutes: number;
        }[];
    }[]>;
    getById(user: AuthenticatedUser, workScheduleId: string): Promise<{
        id: string;
        name: string;
        reminderToleranceMinutes: number;
        isActive: boolean;
        weeklyWorkMinutes: number;
        days: {
            weekday: import("../domain/work-schedule").IsoWeekday;
            weekdayLabel: string;
            start: string;
            breakStart: string;
            breakEnd: string;
            end: string;
            workMinutes: number;
        }[];
    }>;
    create(user: AuthenticatedUser, dto: CreateWorkScheduleDto): Promise<{
        id: string;
        name: string;
        reminderToleranceMinutes: number;
        isActive: boolean;
        weeklyWorkMinutes: number;
        days: {
            weekday: import("../domain/work-schedule").IsoWeekday;
            weekdayLabel: string;
            start: string;
            breakStart: string;
            breakEnd: string;
            end: string;
            workMinutes: number;
        }[];
    }>;
    update(user: AuthenticatedUser, workScheduleId: string, dto: UpdateWorkScheduleDto): Promise<{
        id: string;
        name: string;
        reminderToleranceMinutes: number;
        isActive: boolean;
        weeklyWorkMinutes: number;
        days: {
            weekday: import("../domain/work-schedule").IsoWeekday;
            weekdayLabel: string;
            start: string;
            breakStart: string;
            breakEnd: string;
            end: string;
            workMinutes: number;
        }[];
    }>;
    deactivate(user: AuthenticatedUser, workScheduleId: string): Promise<{
        id: string;
        name: string;
        reminderToleranceMinutes: number;
        isActive: boolean;
        weeklyWorkMinutes: number;
        days: {
            weekday: import("../domain/work-schedule").IsoWeekday;
            weekdayLabel: string;
            start: string;
            breakStart: string;
            breakEnd: string;
            end: string;
            workMinutes: number;
        }[];
    }>;
    activate(user: AuthenticatedUser, workScheduleId: string): Promise<{
        id: string;
        name: string;
        reminderToleranceMinutes: number;
        isActive: boolean;
        weeklyWorkMinutes: number;
        days: {
            weekday: import("../domain/work-schedule").IsoWeekday;
            weekdayLabel: string;
            start: string;
            breakStart: string;
            breakEnd: string;
            end: string;
            workMinutes: number;
        }[];
    }>;
}
