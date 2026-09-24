import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { TimeClockEntryType } from '@prisma/client';
import type { EmployeeProfileWithDetails } from '../domain/employee-profile';
import {
  decideNewEntryType,
  InvalidTimeClockEntryError,
  nextEntryType,
  type TimeClockEntry,
  workedMinutes,
} from '../domain/time-clock-entry';
import { calendarDateToWorkDate, toLocalDateTime } from '../domain/work-date';
import {
  expectedWorkMinutes,
  type IsoWeekday,
  type WorkScheduleDay,
} from '../domain/work-schedule';
import { Clock } from './ports/clock';
import { EmployeeProfileRepository } from './ports/employee-profile.repository';
import { TimeClockEntryRepository } from './ports/time-clock-entry.repository';
import { WorkSchedulesService } from './work-schedules.service';

export interface TodayClockSummary {
  /** "AAAA-MM-DD" no fuso da empresa */
  calendarDate: string;
  isoWeekday: IsoWeekday;
  /** Horários esperados hoje, ou null em dia sem jornada */
  scheduleDay: WorkScheduleDay | null;
  entries: TimeClockEntry[];
  nextEntryType: TimeClockEntryType | null;
  workedMinutes: number;
  expectedMinutes: number;
  serverTime: Date;
}

export interface RegisterEntryResult {
  entry: TimeClockEntry;
  today: TodayClockSummary;
}

@Injectable()
export class TimeClockService {
  constructor(
    private readonly employeeProfiles: EmployeeProfileRepository,
    private readonly entries: TimeClockEntryRepository,
    private readonly workSchedules: WorkSchedulesService,
    private readonly clock: Clock,
  ) {}

  async getToday(userId: string): Promise<TodayClockSummary> {
    const profile = await this.requireActiveProfile(userId);
    return this.buildTodaySummary(profile, this.clock.now());
  }

  async register(userId: string): Promise<RegisterEntryResult> {
    const profile = await this.requireActiveProfile(userId);
    const now = this.clock.now();
    const { calendarDate } = toLocalDateTime(now);

    const entry = await this.appendEntry(profile, calendarDate, now);
    const today = await this.buildTodaySummary(profile, now);

    return { entry, today };
  }

  private async appendEntry(
    profile: EmployeeProfileWithDetails,
    calendarDate: string,
    now: Date,
  ): Promise<TimeClockEntry> {
    try {
      return await this.entries.append(
        {
          companyId: profile.companyId,
          employeeProfileId: profile.id,
          workDate: calendarDateToWorkDate(calendarDate),
          recordedAt: now,
        },
        (entriesOfDay) => decideNewEntryType(entriesOfDay, now),
      );
    } catch (error) {
      if (error instanceof InvalidTimeClockEntryError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  private async buildTodaySummary(
    profile: EmployeeProfileWithDetails,
    now: Date,
  ): Promise<TodayClockSummary> {
    const { calendarDate, isoWeekday } = toLocalDateTime(now);
    const [entriesOfDay, workSchedule] = await Promise.all([
      this.entries.listEffectiveEntries(
        profile.id,
        calendarDateToWorkDate(calendarDate),
      ),
      this.workSchedules.getById(profile.companyId, profile.workScheduleId),
    ]);

    const scheduleDay =
      workSchedule.days.find((day) => day.weekday === isoWeekday) ?? null;

    return {
      calendarDate,
      isoWeekday,
      scheduleDay,
      entries: entriesOfDay,
      nextEntryType: nextEntryType(entriesOfDay),
      workedMinutes: workedMinutes(entriesOfDay, now),
      expectedMinutes: scheduleDay ? expectedWorkMinutes(scheduleDay) : 0,
      serverTime: now,
    };
  }

  private async requireActiveProfile(
    userId: string,
  ): Promise<EmployeeProfileWithDetails> {
    const profile = await this.employeeProfiles.findByUserId(userId);
    if (!profile) {
      throw new ForbiddenException(
        'Você não está cadastrado como funcionário CLT.',
      );
    }
    if (!profile.isActive) {
      throw new ForbiddenException('Seu cadastro de ponto está desativado.');
    }
    return profile;
  }
}
