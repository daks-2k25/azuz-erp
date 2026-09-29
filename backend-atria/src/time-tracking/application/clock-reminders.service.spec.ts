import { TimeClockEntryOrigin, TimeClockEntryType } from '@prisma/client';
import type { TimeClockEntry } from '../domain/time-clock-entry';
import { ClockRemindersService } from './clock-reminders.service';
import { Clock } from './ports/clock';
import {
  ClockReminderRepository,
  type ReminderCandidate,
} from './ports/clock-reminder.repository';
import {
  ReminderNotification,
  ReminderNotifier,
} from './ports/reminder-notifier';
import { TimeClockEntryRepository } from './ports/time-clock-entry.repository';

class FixedClock extends Clock {
  private current = new Date();

  setBrasiliaTime(date: string, time: string) {
    this.current = new Date(`${date}T${time}:00.000-03:00`);
  }

  now() {
    return this.current;
  }
}

class InMemoryReminderRepository extends ClockReminderRepository {
  candidates: ReminderCandidate[] = [];
  readonly recorded = new Set<string>();

  listActiveCandidates() {
    return Promise.resolve(this.candidates);
  }

  tryRecordReminder(
    employeeProfileId: string,
    workDate: Date,
    entryType: TimeClockEntryType,
  ) {
    const key = `${employeeProfileId}|${workDate.toISOString()}|${entryType}`;
    if (this.recorded.has(key)) return Promise.resolve(false);
    this.recorded.add(key);
    return Promise.resolve(true);
  }
}

class InMemoryEntryRepository extends TimeClockEntryRepository {
  entries: TimeClockEntry[] = [];

  listEffectiveEntries(employeeProfileId: string, workDate: Date) {
    return Promise.resolve(
      this.entries.filter(
        (entry) =>
          entry.employeeProfileId === employeeProfileId &&
          entry.workDate.getTime() === workDate.getTime(),
      ),
    );
  }

  append(): Promise<TimeClockEntry> {
    throw new Error('não usado neste teste');
  }

  addEntry(employeeProfileId: string, date: string, type: TimeClockEntryType) {
    this.entries.push({
      id: `${this.entries.length + 1}`,
      companyId: 'company-1',
      employeeProfileId,
      sequenceNumber: BigInt(this.entries.length + 1),
      entryType: type,
      workDate: new Date(`${date}T00:00:00.000Z`),
      recordedAt: new Date(),
      origin: TimeClockEntryOrigin.EMPLOYEE,
    });
  }
}

/** Simula falha de leitura para um funcionário específico. */
class FailingForProfileEntryRepository extends InMemoryEntryRepository {
  constructor(private readonly failingProfileId: string) {
    super();
  }

  listEffectiveEntries(employeeProfileId: string, workDate: Date) {
    if (employeeProfileId === this.failingProfileId) {
      return Promise.reject(new Error('falha simulada'));
    }
    return super.listEffectiveEntries(employeeProfileId, workDate);
  }
}

class RecordingNotifier extends ReminderNotifier {
  readonly sent: ReminderNotification[] = [];

  notify(notification: ReminderNotification) {
    this.sent.push(notification);
    return Promise.resolve();
  }
}

function candidate(id: string): ReminderCandidate {
  return {
    employeeProfileId: `profile-${id}`,
    userId: `user-${id}`,
    companyId: 'company-1',
    toleranceMinutes: 15,
    scheduleDays: ([1, 2, 3, 4] as const).map((weekday) => ({
      weekday,
      startMinutes: 480,
      breakStartMinutes: 780,
      breakEndMinutes: 840,
      endMinutes: 1140,
    })),
  };
}

const THURSDAY = '2026-09-24';
const FRIDAY = '2026-09-25';

describe('ClockRemindersService', () => {
  let clock: FixedClock;
  let reminders: InMemoryReminderRepository;
  let entries: InMemoryEntryRepository;
  let notifier: RecordingNotifier;
  let service: ClockRemindersService;

  beforeEach(() => {
    clock = new FixedClock();
    reminders = new InMemoryReminderRepository();
    entries = new InMemoryEntryRepository();
    notifier = new RecordingNotifier();
    service = new ClockRemindersService(reminders, entries, notifier, clock);
    reminders.candidates = [candidate('a'), candidate('b')];
  });

  it('avisa só quem esqueceu a entrada', async () => {
    entries.addEntry('profile-a', THURSDAY, TimeClockEntryType.CLOCK_IN);
    clock.setBrasiliaTime(THURSDAY, '08:15');

    const sentCount = await service.dispatchDueReminders();

    expect(sentCount).toBe(1);
    expect(notifier.sent).toHaveLength(1);
    expect(notifier.sent[0]).toMatchObject({
      userId: 'user-b',
      companyId: 'company-1',
      title: 'Lembrete de ponto',
    });
    expect(notifier.sent[0].message).toContain('entrada');
  });

  it('envia um único lembrete por marcação, mesmo rodando várias vezes', async () => {
    for (const time of ['08:15', '08:20', '08:25', '10:00']) {
      clock.setBrasiliaTime(THURSDAY, time);
      await service.dispatchDueReminders();
    }

    expect(notifier.sent).toHaveLength(2); // um para cada funcionário
  });

  it('não envia nada antes da tolerância', async () => {
    clock.setBrasiliaTime(THURSDAY, '08:14');
    expect(await service.dispatchDueReminders()).toBe(0);
  });

  it('não envia nada em dia sem jornada (sexta)', async () => {
    clock.setBrasiliaTime(FRIDAY, '10:00');
    expect(await service.dispatchDueReminders()).toBe(0);
  });

  it('um erro em um funcionário não impede os lembretes dos outros', async () => {
    const failingService = new ClockRemindersService(
      reminders,
      new FailingForProfileEntryRepository('profile-a'),
      notifier,
      clock,
    );
    clock.setBrasiliaTime(THURSDAY, '08:15');

    expect(await failingService.dispatchDueReminders()).toBe(1);
    expect(notifier.sent[0].userId).toBe('user-b');
  });
});
