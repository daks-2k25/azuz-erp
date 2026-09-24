import { TimeClockEntryType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ClockReminderRepository, ReminderCandidate } from '../application/ports/clock-reminder.repository';
export declare class PrismaClockReminderRepository extends ClockReminderRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listActiveCandidates(): Promise<ReminderCandidate[]>;
    tryRecordReminder(employeeProfileId: string, workDate: Date, entryType: TimeClockEntryType): Promise<boolean>;
}
