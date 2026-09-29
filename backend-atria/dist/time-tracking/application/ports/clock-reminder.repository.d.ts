import type { TimeClockEntryType } from '@prisma/client';
import type { WorkScheduleDay } from '../../domain/work-schedule';
export interface ReminderCandidate {
    employeeProfileId: string;
    userId: string;
    companyId: string;
    toleranceMinutes: number;
    scheduleDays: WorkScheduleDay[];
}
export declare abstract class ClockReminderRepository {
    abstract listActiveCandidates(): Promise<ReminderCandidate[]>;
    abstract tryRecordReminder(employeeProfileId: string, workDate: Date, entryType: TimeClockEntryType): Promise<boolean>;
}
