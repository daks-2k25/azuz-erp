import type { TimeClockEntryType } from '@prisma/client';
import type {
  RegisterEntryResult,
  TodayClockSummary,
} from '../application/time-clock.service';
import { minutesToClockTime } from '../domain/clock-time';
import {
  ENTRY_TYPE_LABELS,
  type TimeClockEntry,
} from '../domain/time-clock-entry';
import { toLocalDateTime } from '../domain/work-date';
import { WEEKDAY_LABELS, type WorkScheduleDay } from '../domain/work-schedule';

/** Mesmo tamanho do NSR no padrão oficial (Portaria 671). */
const SEQUENCE_NUMBER_DIGITS = 9;

export function toTodayClockResponse(today: TodayClockSummary) {
  return {
    date: today.calendarDate,
    weekday: today.isoWeekday,
    weekdayLabel: WEEKDAY_LABELS[today.isoWeekday],
    isWorkday: today.scheduleDay !== null,
    expected: today.scheduleDay ? toExpectedTimes(today.scheduleDay) : null,
    entries: today.entries.map(toTimeClockEntryResponse),
    nextEntry: toNextEntry(today.nextEntryType),
    workedMinutes: today.workedMinutes,
    expectedMinutes: today.expectedMinutes,
    serverTime: today.serverTime.toISOString(),
  };
}

export function toRegisterEntryResponse(result: RegisterEntryResult) {
  return {
    entry: toTimeClockEntryResponse(result.entry),
    today: toTodayClockResponse(result.today),
  };
}

function toTimeClockEntryResponse(entry: TimeClockEntry) {
  return {
    id: entry.id,
    entryType: entry.entryType,
    label: ENTRY_TYPE_LABELS[entry.entryType],
    recordedAt: entry.recordedAt.toISOString(),
    /** Horário local (Brasília) no formato "HH:mm" */
    time: minutesToClockTime(toLocalDateTime(entry.recordedAt).minutesOfDay),
    sequenceNumber: entry.sequenceNumber
      .toString()
      .padStart(SEQUENCE_NUMBER_DIGITS, '0'),
    origin: entry.origin,
  };
}

function toExpectedTimes(day: WorkScheduleDay) {
  return {
    CLOCK_IN: minutesToClockTime(day.startMinutes),
    BREAK_START: minutesToClockTime(day.breakStartMinutes),
    BREAK_END: minutesToClockTime(day.breakEndMinutes),
    CLOCK_OUT: minutesToClockTime(day.endMinutes),
  } satisfies Record<TimeClockEntryType, string>;
}

function toNextEntry(entryType: TimeClockEntryType | null) {
  return entryType ? { entryType, label: ENTRY_TYPE_LABELS[entryType] } : null;
}
