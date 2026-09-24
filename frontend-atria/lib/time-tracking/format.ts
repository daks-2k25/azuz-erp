const COMPANY_TIME_ZONE = "America/Sao_Paulo";

const clockFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: COMPANY_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** 600 -> "10h", 525 -> "8h45" */
export function formatMinutesAsHours(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0
    ? `${hours}h`
    : `${hours}h${String(minutes).padStart(2, "0")}`;
}

/** "2026-09-24" -> "24/09/2026" */
export function formatCalendarDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

/** Horário de Brasília com segundos: "08:02:15" */
export function formatClockTime(date: Date): string {
  return clockFormatter.format(date);
}
