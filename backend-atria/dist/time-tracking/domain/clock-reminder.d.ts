import { TimeClockEntryType } from '@prisma/client';
import { type TimeClockEntry } from './time-clock-entry';
import type { WorkScheduleDay } from './work-schedule';
export interface DueReminder {
    entryType: TimeClockEntryType;
    expectedMinutes: number;
}
export interface ReminderCheck {
    scheduleDay: WorkScheduleDay | null;
    toleranceMinutes: number;
    entriesOfDay: Pick<TimeClockEntry, 'entryType'>[];
    minutesOfDay: number;
}
export declare function findDueReminder(check: ReminderCheck): DueReminder | null;
export declare function reminderNotificationText(reminder: DueReminder): {
    title: string;
    message: string;
};
