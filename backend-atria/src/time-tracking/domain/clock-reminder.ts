import { TimeClockEntryType } from '@prisma/client';
import { minutesToClockTime } from './clock-time';
import {
  ENTRY_TYPE_LABELS,
  nextEntryType,
  type TimeClockEntry,
} from './time-clock-entry';
import type { WorkScheduleDay } from './work-schedule';

export interface DueReminder {
  entryType: TimeClockEntryType;
  /** Horário previsto da marcação, em minutos desde 00:00 */
  expectedMinutes: number;
}

export interface ReminderCheck {
  /** Horários de hoje, ou null em dia sem jornada */
  scheduleDay: WorkScheduleDay | null;
  toleranceMinutes: number;
  entriesOfDay: Pick<TimeClockEntry, 'entryType'>[];
  /** Horário atual no fuso da empresa, em minutos desde 00:00 */
  minutesOfDay: number;
}

/**
 * Lembrete devido agora: a próxima marcação esperada ainda não foi feita
 * e o horário previsto + tolerância já passou. Só olha a próxima marcação,
 * porque as seguintes não podem ser feitas antes dela.
 */
export function findDueReminder(check: ReminderCheck): DueReminder | null {
  if (!check.scheduleDay) return null;

  const entryType = nextEntryType(check.entriesOfDay);
  if (!entryType) return null;

  const expectedMinutes = expectedMinutesFor(check.scheduleDay, entryType);
  const isOverdue =
    check.minutesOfDay >= expectedMinutes + check.toleranceMinutes;

  return isOverdue ? { entryType, expectedMinutes } : null;
}

export function reminderNotificationText(reminder: DueReminder): {
  title: string;
  message: string;
} {
  const label = ENTRY_TYPE_LABELS[reminder.entryType].toLowerCase();
  const expectedTime = minutesToClockTime(reminder.expectedMinutes);

  return {
    title: 'Lembrete de ponto',
    message: `Você ainda não registrou a ${label} de hoje (prevista para ${expectedTime}). Registre na aba Ponto.`,
  };
}

function expectedMinutesFor(
  day: WorkScheduleDay,
  entryType: TimeClockEntryType,
): number {
  const expectedByType: Record<TimeClockEntryType, number> = {
    CLOCK_IN: day.startMinutes,
    BREAK_START: day.breakStartMinutes,
    BREAK_END: day.breakEndMinutes,
    CLOCK_OUT: day.endMinutes,
  };
  return expectedByType[entryType];
}
