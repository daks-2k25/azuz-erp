import type { EmployeeProfileWithDetails } from '../domain/employee-profile';
import { type IsoWeekday, type WorkSchedule, type WorkScheduleDay } from '../domain/work-schedule';
import type { WorkScheduleDayDto } from './dto/work-schedule.dto';
export declare function toWorkScheduleDays(dtos: WorkScheduleDayDto[]): WorkScheduleDay[];
export declare function parseCalendarDate(value: string): Date;
export declare function toWorkScheduleResponse(workSchedule: WorkSchedule): {
    id: string;
    name: string;
    reminderToleranceMinutes: number;
    isActive: boolean;
    weeklyWorkMinutes: number;
    days: {
        weekday: IsoWeekday;
        weekdayLabel: string;
        start: string;
        breakStart: string;
        breakEnd: string;
        end: string;
        workMinutes: number;
    }[];
};
export declare function toEmployeeProfileResponse(profile: EmployeeProfileWithDetails): {
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
};
