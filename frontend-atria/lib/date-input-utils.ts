const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DISPLAY_DATE_RE = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const DISPLAY_DATETIME_RE =
  /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/;

function isValidCalendarDate(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isoDateToDisplay(iso: string): string {
  const trimmed = iso.trim();
  if (!trimmed) return "";

  const match = trimmed.match(ISO_DATE_RE);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return "";

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = String(parsed.getFullYear());
  return `${day}/${month}/${year}`;
}

export function displayDateToIso(display: string): string | null {
  const trimmed = display.trim();
  if (!trimmed) return "";

  const match = trimmed.match(DISPLAY_DATE_RE);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (!isValidCalendarDate(year, month, day)) return null;

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function dateTimeLocalToDisplay(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const localMatch = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/,
  );
  if (localMatch) {
    return `${localMatch[3]}/${localMatch[2]}/${localMatch[1]} ${localMatch[4]}:${localMatch[5]}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return "";

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = String(parsed.getFullYear());
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function displayDateTimeToLocal(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const match = trimmed.match(DISPLAY_DATETIME_RE);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const hours = Number(match[4]);
  const minutes = Number(match[5]);

  if (!isValidCalendarDate(year, month, day)) return null;
  if (hours > 23 || minutes > 59) return null;

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
