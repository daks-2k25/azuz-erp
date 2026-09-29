import { PrismaService } from '../../prisma/prisma.service';
import type { TimeClockEntry } from '../domain/time-clock-entry';
import { AppendEntryData, EntryTypeDecider, TimeClockEntryRepository } from '../application/ports/time-clock-entry.repository';
export declare class PrismaTimeClockEntryRepository extends TimeClockEntryRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listEffectiveEntries(employeeProfileId: string, workDate: Date): Promise<TimeClockEntry[]>;
    append(data: AppendEntryData, decideEntryType: EntryTypeDecider): Promise<TimeClockEntry>;
}
