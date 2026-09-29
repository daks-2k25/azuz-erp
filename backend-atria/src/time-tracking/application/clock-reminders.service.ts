import { Injectable, Logger } from '@nestjs/common';
import {
  findDueReminder,
  reminderNotificationText,
} from '../domain/clock-reminder';
import {
  calendarDateToWorkDate,
  type LocalDateTime,
  toLocalDateTime,
} from '../domain/work-date';
import { Clock } from './ports/clock';
import {
  ClockReminderRepository,
  type ReminderCandidate,
} from './ports/clock-reminder.repository';
import { ReminderNotifier } from './ports/reminder-notifier';
import { TimeClockEntryRepository } from './ports/time-clock-entry.repository';

@Injectable()
export class ClockRemindersService {
  private readonly logger = new Logger(ClockRemindersService.name);

  constructor(
    private readonly reminders: ClockReminderRepository,
    private readonly entries: TimeClockEntryRepository,
    private readonly notifier: ReminderNotifier,
    private readonly clock: Clock,
  ) {}

  /** Envia os lembretes devidos agora. Retorna quantos foram enviados. */
  async dispatchDueReminders(): Promise<number> {
    const localNow = toLocalDateTime(this.clock.now());
    const candidates = await this.reminders.listActiveCandidates();

    let sentCount = 0;
    for (const candidate of candidates) {
      try {
        const wasSent = await this.remindIfDue(candidate, localNow);
        if (wasSent) sentCount += 1;
      } catch (error) {
        // Um funcionário com problema não pode impedir os lembretes dos outros.
        this.logger.error(
          `Falha ao processar lembrete do cadastro ${candidate.employeeProfileId}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }

    return sentCount;
  }

  private async remindIfDue(
    candidate: ReminderCandidate,
    localNow: LocalDateTime,
  ): Promise<boolean> {
    const scheduleDay =
      candidate.scheduleDays.find(
        (day) => day.weekday === localNow.isoWeekday,
      ) ?? null;
    if (!scheduleDay) return false;

    const workDate = calendarDateToWorkDate(localNow.calendarDate);
    const entriesOfDay = await this.entries.listEffectiveEntries(
      candidate.employeeProfileId,
      workDate,
    );

    const dueReminder = findDueReminder({
      scheduleDay,
      toleranceMinutes: candidate.toleranceMinutes,
      entriesOfDay,
      minutesOfDay: localNow.minutesOfDay,
    });
    if (!dueReminder) return false;

    const isFirstTime = await this.reminders.tryRecordReminder(
      candidate.employeeProfileId,
      workDate,
      dueReminder.entryType,
    );
    if (!isFirstTime) return false;

    await this.notifier.notify({
      userId: candidate.userId,
      companyId: candidate.companyId,
      ...reminderNotificationText(dueReminder),
    });
    return true;
  }
}
