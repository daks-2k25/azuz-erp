export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

/** Formato "HH:mm" em 24 horas (ex.: "08:00", "19:30"). */
export const CLOCK_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidClockTime(value: string): boolean {
  return CLOCK_TIME_PATTERN.test(value);
}

/** Converte "HH:mm" para minutos desde 00:00. */
export function clockTimeToMinutes(value: string): number {
  if (!isValidClockTime(value)) {
    throw new Error(`Horário inválido: "${value}". Use o formato HH:mm.`);
  }

  const [hours, minutes] = value.split(':').map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
}

/** Converte minutos desde 00:00 para "HH:mm". */
export function minutesToClockTime(totalMinutes: number): string {
  if (
    !Number.isInteger(totalMinutes) ||
    totalMinutes < 0 ||
    totalMinutes > MINUTES_PER_DAY
  ) {
    throw new Error(`Minutos fora do intervalo de um dia: ${totalMinutes}.`);
  }

  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
