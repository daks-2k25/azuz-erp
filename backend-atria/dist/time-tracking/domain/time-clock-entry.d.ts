import { TimeClockEntryOrigin, TimeClockEntryType } from '@prisma/client';
export declare const DAILY_ENTRY_SEQUENCE: readonly TimeClockEntryType[];
export declare const ENTRY_TYPE_LABELS: Record<TimeClockEntryType, string>;
export interface TimeClockEntry {
    id: string;
    companyId: string;
    employeeProfileId: string;
    sequenceNumber: bigint;
    entryType: TimeClockEntryType;
    workDate: Date;
    recordedAt: Date;
    origin: TimeClockEntryOrigin;
}
export declare class InvalidTimeClockEntryError extends Error {
    constructor(message: string);
}
export declare const MIN_SECONDS_BETWEEN_ENTRIES = 60;
export declare function nextEntryType(entriesOfDay: Pick<TimeClockEntry, 'entryType'>[]): TimeClockEntryType | null;
export declare function decideNewEntryType(entriesOfDay: Pick<TimeClockEntry, 'entryType' | 'recordedAt'>[], now: Date): TimeClockEntryType;
export declare function workedMinutes(entriesOfDay: Pick<TimeClockEntry, 'entryType' | 'recordedAt'>[], now: Date): number;
