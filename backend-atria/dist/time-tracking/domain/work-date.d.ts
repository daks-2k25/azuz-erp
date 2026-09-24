import type { IsoWeekday } from './work-schedule';
export declare const COMPANY_TIME_ZONE = "America/Sao_Paulo";
export interface LocalDateTime {
    calendarDate: string;
    isoWeekday: IsoWeekday;
    minutesOfDay: number;
}
export declare function toLocalDateTime(instant: Date): LocalDateTime;
export declare function calendarDateToWorkDate(calendarDate: string): Date;
