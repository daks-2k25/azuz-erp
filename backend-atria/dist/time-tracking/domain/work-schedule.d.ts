export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export declare const WEEKDAY_LABELS: Record<IsoWeekday, string>;
export declare const MIN_REMINDER_TOLERANCE_MINUTES = 0;
export declare const MAX_REMINDER_TOLERANCE_MINUTES = 120;
export declare const DEFAULT_REMINDER_TOLERANCE_MINUTES = 15;
export interface WorkScheduleDay {
    weekday: IsoWeekday;
    startMinutes: number;
    breakStartMinutes: number;
    breakEndMinutes: number;
    endMinutes: number;
}
export interface WorkSchedule {
    id: string;
    companyId: string;
    name: string;
    reminderToleranceMinutes: number;
    isActive: boolean;
    days: WorkScheduleDay[];
}
export declare class InvalidWorkScheduleError extends Error {
    constructor(message: string);
}
export declare function isIsoWeekday(value: number): value is IsoWeekday;
export declare function expectedWorkMinutes(day: WorkScheduleDay): number;
export declare function expectedWeeklyWorkMinutes(days: WorkScheduleDay[]): number;
export declare function assertValidWorkScheduleDays(days: WorkScheduleDay[]): void;
export declare function assertValidReminderTolerance(minutes: number): void;
