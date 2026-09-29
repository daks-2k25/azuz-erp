import { ClockRemindersService } from '../application/clock-reminders.service';
export declare class ClockReminderScheduler {
    private readonly clockReminders;
    private readonly logger;
    private isRunning;
    constructor(clockReminders: ClockRemindersService);
    handleCron(): Promise<void>;
}
