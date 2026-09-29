export declare class WorkScheduleDayDto {
    weekday: number;
    start: string;
    breakStart: string;
    breakEnd: string;
    end: string;
}
export declare class CreateWorkScheduleDto {
    name: string;
    reminderToleranceMinutes?: number;
    days: WorkScheduleDayDto[];
}
export declare class UpdateWorkScheduleDto {
    name?: string;
    reminderToleranceMinutes?: number;
    days?: WorkScheduleDayDto[];
}
