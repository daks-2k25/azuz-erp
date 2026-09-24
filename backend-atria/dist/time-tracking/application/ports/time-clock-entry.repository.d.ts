import type { TimeClockEntryType } from '@prisma/client';
import type { TimeClockEntry } from '../../domain/time-clock-entry';
export interface AppendEntryData {
    companyId: string;
    employeeProfileId: string;
    workDate: Date;
    recordedAt: Date;
}
export type EntryTypeDecider = (entriesOfDay: TimeClockEntry[]) => TimeClockEntryType;
export declare abstract class TimeClockEntryRepository {
    abstract listEffectiveEntries(employeeProfileId: string, workDate: Date): Promise<TimeClockEntry[]>;
    abstract append(data: AppendEntryData, decideEntryType: EntryTypeDecider): Promise<TimeClockEntry>;
}
