import { MINUTES_PER_HOUR } from './clock-time';
import type { IsoWeekday } from './work-schedule';

/** Fuso usado para decidir "que dia é hoje" e o horário local das marcações. */
export const COMPANY_TIME_ZONE = 'America/Sao_Paulo';

export interface LocalDateTime {
  /** "AAAA-MM-DD" no fuso da empresa */
  calendarDate: string;
  isoWeekday: IsoWeekday;
  /** Minutos desde 00:00 no fuso da empresa */
  minutesOfDay: number;
}

const WEEKDAY_BY_SHORT_NAME: Record<string, IsoWeekday> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

const localPartsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: COMPANY_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** Converte um instante (UTC) para data, dia da semana e horário no fuso da empresa. */
export function toLocalDateTime(instant: Date): LocalDateTime {
  const parts = Object.fromEntries(
    localPartsFormatter
      .formatToParts(instant)
      .map((part) => [part.type, part.value]),
  );

  return {
    calendarDate: `${parts.year}-${parts.month}-${parts.day}`,
    isoWeekday: WEEKDAY_BY_SHORT_NAME[parts.weekday],
    minutesOfDay: Number(parts.hour) * MINUTES_PER_HOUR + Number(parts.minute),
  };
}

/** "AAAA-MM-DD" -> Date à meia-noite UTC, formato usado nas colunas DATE. */
export function calendarDateToWorkDate(calendarDate: string): Date {
  return new Date(`${calendarDate}T00:00:00.000Z`);
}
