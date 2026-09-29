import { type AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { TimeClockService } from '../application/time-clock.service';
export declare class MyTimeClockController {
    private readonly timeClock;
    constructor(timeClock: TimeClockService);
    getToday(user: AuthenticatedUser): Promise<{
        date: string;
        weekday: import("../domain/work-schedule").IsoWeekday;
        weekdayLabel: string;
        isWorkday: boolean;
        expected: {
            CLOCK_IN: string;
            BREAK_START: string;
            BREAK_END: string;
            CLOCK_OUT: string;
        } | null;
        entries: {
            id: string;
            entryType: import("@prisma/client").$Enums.TimeClockEntryType;
            label: string;
            recordedAt: string;
            time: string;
            sequenceNumber: string;
            origin: import("@prisma/client").$Enums.TimeClockEntryOrigin;
        }[];
        nextEntry: {
            entryType: import("@prisma/client").$Enums.TimeClockEntryType;
            label: string;
        } | null;
        workedMinutes: number;
        expectedMinutes: number;
        serverTime: string;
    }>;
    register(user: AuthenticatedUser): Promise<{
        entry: {
            id: string;
            entryType: import("@prisma/client").$Enums.TimeClockEntryType;
            label: string;
            recordedAt: string;
            time: string;
            sequenceNumber: string;
            origin: import("@prisma/client").$Enums.TimeClockEntryOrigin;
        };
        today: {
            date: string;
            weekday: import("../domain/work-schedule").IsoWeekday;
            weekdayLabel: string;
            isWorkday: boolean;
            expected: {
                CLOCK_IN: string;
                BREAK_START: string;
                BREAK_END: string;
                CLOCK_OUT: string;
            } | null;
            entries: {
                id: string;
                entryType: import("@prisma/client").$Enums.TimeClockEntryType;
                label: string;
                recordedAt: string;
                time: string;
                sequenceNumber: string;
                origin: import("@prisma/client").$Enums.TimeClockEntryOrigin;
            }[];
            nextEntry: {
                entryType: import("@prisma/client").$Enums.TimeClockEntryType;
                label: string;
            } | null;
            workedMinutes: number;
            expectedMinutes: number;
            serverTime: string;
        };
    }>;
}
