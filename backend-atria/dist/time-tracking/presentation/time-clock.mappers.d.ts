import type { RegisterEntryResult, TodayClockSummary } from '../application/time-clock.service';
export declare function toTodayClockResponse(today: TodayClockSummary): {
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
export declare function toRegisterEntryResponse(result: RegisterEntryResult): {
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
};
