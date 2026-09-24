import { Clock } from './ports/clock';
import { ClockReminderRepository } from './ports/clock-reminder.repository';
import { ReminderNotifier } from './ports/reminder-notifier';
import { TimeClockEntryRepository } from './ports/time-clock-entry.repository';
export declare class ClockRemindersService {
    private readonly reminders;
    private readonly entries;
    private readonly notifier;
    private readonly clock;
    private readonly logger;
    constructor(reminders: ClockReminderRepository, entries: TimeClockEntryRepository, notifier: ReminderNotifier, clock: Clock);
    dispatchDueReminders(): Promise<number>;
    private remindIfDue;
}
