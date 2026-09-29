import { MINUTES_PER_DAY } from './clock-time';

/** Dia da semana no padrão ISO: 1 = segunda ... 7 = domingo. */
export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const WEEKDAY_LABELS: Record<IsoWeekday, string> = {
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
  7: 'Domingo',
};

export const MIN_REMINDER_TOLERANCE_MINUTES = 0;
export const MAX_REMINDER_TOLERANCE_MINUTES = 120;
export const DEFAULT_REMINDER_TOLERANCE_MINUTES = 15;

/** Horários de um dia de trabalho, em minutos desde 00:00. */
export interface WorkScheduleDay {
  weekday: IsoWeekday;
  startMinutes: number;
  breakStartMinutes: number;
  breakEndMinutes: number;
  endMinutes: number;
}

export interface WorkSchedule {
  id: string;
  companyId: string;
  name: string;
  reminderToleranceMinutes: number;
  isActive: boolean;
  days: WorkScheduleDay[];
}

export class InvalidWorkScheduleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = InvalidWorkScheduleError.name;
  }
}

export function isIsoWeekday(value: number): value is IsoWeekday {
  return Number.isInteger(value) && value >= 1 && value <= 7;
}

/** Minutos efetivamente trabalhados no dia, descontando o intervalo. */
export function expectedWorkMinutes(day: WorkScheduleDay): number {
  const breakMinutes = day.breakEndMinutes - day.breakStartMinutes;
  return day.endMinutes - day.startMinutes - breakMinutes;
}

export function expectedWeeklyWorkMinutes(days: WorkScheduleDay[]): number {
  return days.reduce((total, day) => total + expectedWorkMinutes(day), 0);
}

/** Garante as mesmas regras das constraints do banco, com mensagens legíveis. */
export function assertValidWorkScheduleDays(days: WorkScheduleDay[]): void {
  if (days.length === 0) {
    throw new InvalidWorkScheduleError(
      'A jornada precisa ter pelo menos um dia de trabalho.',
    );
  }

  const seenWeekdays = new Set<IsoWeekday>();
  for (const day of days) {
    assertValidWeekday(day.weekday);

    if (seenWeekdays.has(day.weekday)) {
      throw new InvalidWorkScheduleError(
        `${WEEKDAY_LABELS[day.weekday]} foi informado mais de uma vez.`,
      );
    }
    seenWeekdays.add(day.weekday);

    assertChronologicalTimes(day);
  }
}

export function assertValidReminderTolerance(minutes: number): void {
  const isInRange =
    Number.isInteger(minutes) &&
    minutes >= MIN_REMINDER_TOLERANCE_MINUTES &&
    minutes <= MAX_REMINDER_TOLERANCE_MINUTES;

  if (!isInRange) {
    throw new InvalidWorkScheduleError(
      `A tolerância do lembrete deve ser entre ${MIN_REMINDER_TOLERANCE_MINUTES} e ${MAX_REMINDER_TOLERANCE_MINUTES} minutos.`,
    );
  }
}

function assertValidWeekday(weekday: number): void {
  if (!isIsoWeekday(weekday)) {
    throw new InvalidWorkScheduleError(
      `Dia da semana inválido: ${weekday}. Use 1 (segunda) a 7 (domingo).`,
    );
  }
}

function assertChronologicalTimes(day: WorkScheduleDay): void {
  const isChronological =
    day.startMinutes >= 0 &&
    day.startMinutes < day.breakStartMinutes &&
    day.breakStartMinutes < day.breakEndMinutes &&
    day.breakEndMinutes < day.endMinutes &&
    day.endMinutes <= MINUTES_PER_DAY;

  if (!isChronological) {
    throw new InvalidWorkScheduleError(
      `${WEEKDAY_LABELS[day.weekday]}: os horários devem seguir a ordem entrada < saída para intervalo < volta do intervalo < saída.`,
    );
  }
}
