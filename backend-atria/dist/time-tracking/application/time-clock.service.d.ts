import type { TimeClockEntryType } from '@prisma/client';
import { type TimeClockEntry } from '../domain/time-clock-entry';
import { type IsoWeekday, type WorkScheduleDay } from '../domain/work-schedule';
import { Clock } from './ports/clock';
import { EmployeeProfileRepository } from './ports/employee-profile.repository';
import { TimeClockEntryRepository } from './ports/time-clock-entry.repository';
import { WorkSchedulesService } from './work-schedules.service';
export interface TodayClockSummary {
    calendarDate: string;
    isoWeekday: IsoWeekday;
    scheduleDay: WorkScheduleDay | null;
    entries: TimeClockEntry[];
    nextEntryType: TimeClockEntryType | null;
    workedMinutes: number;
    expectedMinutes: number;
    serverTime: Date;
}
export interface RegisterEntryResult {
    entry: TimeClockEntry;
    today: TodayClockSummary;
}
export declare class TimeClockService {
    private readonly employeeProfiles;
    private readonly entries;
    private readonly workSchedules;
    private readonly clock;
    constructor(employeeProfiles: EmployeeProfileRepository, entries: TimeClockEntryRepository, workSchedules: WorkSchedulesService, clock: Clock);
    getToday(userId: string): Promise<TodayClockSummary>;
    register(userId: string): Promise<RegisterEntryResult>;
    private appendEntry;
    private buildTodaySummary;
    private requireActiveProfile;
}
