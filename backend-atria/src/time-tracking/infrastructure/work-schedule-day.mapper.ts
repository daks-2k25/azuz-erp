import type { WorkScheduleDay as WorkScheduleDayRecord } from '@prisma/client';
import { isIsoWeekday, type WorkScheduleDay } from '../domain/work-schedule';

/** Converte a linha do banco para o tipo de domínio, validando o dia da semana. */
export function toWorkScheduleDay(
  record: Pick<
    WorkScheduleDayRecord,
    | 'weekday'
    | 'startMinutes'
    | 'breakStartMinutes'
    | 'breakEndMinutes'
    | 'endMinutes'
  >,
): WorkScheduleDay {
  if (!isIsoWeekday(record.weekday)) {
    throw new Error(`Dia da semana inválido no banco: ${record.weekday}.`);
  }

  return {
    weekday: record.weekday,
    startMinutes: record.startMinutes,
    breakStartMinutes: record.breakStartMinutes,
    breakEndMinutes: record.breakEndMinutes,
    endMinutes: record.endMinutes,
  };
}
