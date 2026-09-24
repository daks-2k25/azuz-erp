import { ConflictException, ForbiddenException } from '@nestjs/common';
import { TimeClockEntryOrigin, TimeClockEntryType } from '@prisma/client';
import type { EmployeeProfileWithDetails } from '../domain/employee-profile';
import type { TimeClockEntry } from '../domain/time-clock-entry';
import type { WorkSchedule } from '../domain/work-schedule';
import { Clock } from './ports/clock';
import { EmployeeProfileRepository } from './ports/employee-profile.repository';
import {
  AppendEntryData,
  EntryTypeDecider,
  TimeClockEntryRepository,
} from './ports/time-clock-entry.repository';
import { TimeClockService } from './time-clock.service';
import { WorkSchedulesService } from './work-schedules.service';

const COMPANY_ID = 'company-1';
const CLT_USER_ID = 'user-clt';

class FixedClock extends Clock {
  private current = new Date();

  setBrasiliaTime(date: string, time: string) {
    this.current = new Date(`${date}T${time}:00.000-03:00`);
  }

  now() {
    return this.current;
  }
}

class InMemoryTimeClockEntryRepository extends TimeClockEntryRepository {
  readonly entries: TimeClockEntry[] = [];
  private lastSequenceNumber = 0n;

  listEffectiveEntries(employeeProfileId: string, workDate: Date) {
    return Promise.resolve(
      this.entries.filter(
        (entry) =>
          entry.employeeProfileId === employeeProfileId &&
          entry.workDate.getTime() === workDate.getTime(),
      ),
    );
  }

  async append(data: AppendEntryData, decideEntryType: EntryTypeDecider) {
    const entriesOfDay = await this.listEffectiveEntries(
      data.employeeProfileId,
      data.workDate,
    );
    const entryType = decideEntryType(entriesOfDay);

    this.lastSequenceNumber += 1n;
    const entry: TimeClockEntry = {
      id: `entry-${this.lastSequenceNumber}`,
      sequenceNumber: this.lastSequenceNumber,
      entryType,
      origin: TimeClockEntryOrigin.EMPLOYEE,
      ...data,
    };
    this.entries.push(entry);
    return entry;
  }
}

function buildProfile(isActive = true): EmployeeProfileWithDetails {
  return {
    id: 'profile-1',
    companyId: COMPANY_ID,
    userId: CLT_USER_ID,
    employmentType: 'CLT',
    admissionDate: new Date('2026-01-15T00:00:00.000Z'),
    workScheduleId: 'schedule-1',
    isActive,
    user: { id: CLT_USER_ID, name: 'CLT', email: 'clt@test', avatarUrl: null },
    workSchedule: { id: 'schedule-1', name: 'Seg a Qui' },
  };
}

const MONDAY_TO_THURSDAY_SCHEDULE: WorkSchedule = {
  id: 'schedule-1',
  companyId: COMPANY_ID,
  name: 'Seg a Qui',
  reminderToleranceMinutes: 15,
  isActive: true,
  days: ([1, 2, 3, 4] as const).map((weekday) => ({
    weekday,
    startMinutes: 480,
    breakStartMinutes: 780,
    breakEndMinutes: 840,
    endMinutes: 1140,
  })),
};

describe('TimeClockService', () => {
  let clock: FixedClock;
  let entries: InMemoryTimeClockEntryRepository;
  let profile: EmployeeProfileWithDetails | null;
  let service: TimeClockService;

  beforeEach(() => {
    clock = new FixedClock();
    entries = new InMemoryTimeClockEntryRepository();
    profile = buildProfile();

    const employeeProfiles = {
      findByUserId: (userId: string) =>
        Promise.resolve(userId === CLT_USER_ID ? profile : null),
    } as unknown as EmployeeProfileRepository;
    const workSchedules = {
      getById: () => Promise.resolve(MONDAY_TO_THURSDAY_SCHEDULE),
    } as unknown as WorkSchedulesService;

    service = new TimeClockService(
      employeeProfiles,
      entries,
      workSchedules,
      clock,
    );
  });

  it('registra um dia completo na ordem certa e soma 10h', async () => {
    const thursday = '2026-09-24';
    const registered: TimeClockEntryType[] = [];

    for (const time of ['08:00', '13:00', '14:00', '19:00']) {
      clock.setBrasiliaTime(thursday, time);
      const { entry } = await service.register(CLT_USER_ID);
      registered.push(entry.entryType);
    }

    expect(registered).toEqual([
      TimeClockEntryType.CLOCK_IN,
      TimeClockEntryType.BREAK_START,
      TimeClockEntryType.BREAK_END,
      TimeClockEntryType.CLOCK_OUT,
    ]);

    const today = await service.getToday(CLT_USER_ID);
    expect(today.workedMinutes).toBe(600);
    expect(today.expectedMinutes).toBe(600);
    expect(today.nextEntryType).toBeNull();
    expect(entries.entries.map((entry) => entry.sequenceNumber)).toEqual([
      1n,
      2n,
      3n,
      4n,
    ]);
  });

  it('usa a data de Brasília, não a de UTC', async () => {
    // 23:30 de quinta em Brasília já é sexta em UTC
    clock.setBrasiliaTime('2026-09-24', '23:30');
    const { entry } = await service.register(CLT_USER_ID);

    expect(entry.workDate.toISOString()).toBe('2026-09-24T00:00:00.000Z');
  });

  it('recusa a quinta marcação do dia com 409', async () => {
    for (const time of ['08:00', '13:00', '14:00', '19:00']) {
      clock.setBrasiliaTime('2026-09-24', time);
      await service.register(CLT_USER_ID);
    }
    clock.setBrasiliaTime('2026-09-24', '19:30');

    await expect(service.register(CLT_USER_ID)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('recusa clique duplo com 409', async () => {
    clock.setBrasiliaTime('2026-09-24', '08:00');
    await service.register(CLT_USER_ID);

    await expect(service.register(CLT_USER_ID)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('sexta-feira não tem jornada, mas a marcação é aceita', async () => {
    clock.setBrasiliaTime('2026-09-25', '09:00');
    const { today } = await service.register(CLT_USER_ID);

    expect(today.scheduleDay).toBeNull();
    expect(today.expectedMinutes).toBe(0);
    expect(today.entries).toHaveLength(1);
  });

  it('recusa quem não é CLT com 403', async () => {
    await expect(service.register('outro-usuario')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('recusa funcionário desativado com 403', async () => {
    profile = buildProfile(false);
    await expect(service.getToday(CLT_USER_ID)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
