export type CreationPeriod = "day" | "week" | "month";

const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

const WEEKDAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

export function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

export function startOfWeek(date: Date) {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

export function endOfWeek(date: Date) {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function getPeriodBounds(period: CreationPeriod, anchor: Date) {
  switch (period) {
    case "day":
      return { from: startOfDay(anchor), to: endOfDay(anchor) };
    case "week":
      return { from: startOfWeek(anchor), to: endOfWeek(anchor) };
    case "month":
      return { from: startOfMonth(anchor), to: endOfMonth(anchor) };
  }
}

export function stepPeriod(
  period: CreationPeriod,
  anchor: Date,
  direction: -1 | 1,
) {
  const next = new Date(anchor);
  if (period === "day") {
    next.setDate(next.getDate() + direction);
    return next;
  }
  if (period === "week") {
    next.setDate(next.getDate() + direction * 7);
    return next;
  }
  next.setMonth(next.getMonth() + direction);
  return next;
}

export function formatPeriodLabel(period: CreationPeriod, anchor: Date) {
  if (period === "day") {
    const today = startOfDay(new Date());
    const target = startOfDay(anchor);
    const prefix =
      target.getTime() === today.getTime()
        ? "Hoje: "
        : "";
    return `${prefix}${anchor.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  }

  if (period === "week") {
    const from = startOfWeek(anchor);
    const to = endOfWeek(anchor);
    const sameMonth = from.getMonth() === to.getMonth();
    const fromLabel = from.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: sameMonth ? undefined : "short",
    });
    const toLabel = to.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${fromLabel} – ${toLabel}`;
  }

  return anchor.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export function getWeekDays(anchor: Date) {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function getWeekdayLabel(date: Date, short = false) {
  const labels = short ? WEEKDAY_SHORT : WEEKDAY_LABELS;
  return labels[date.getDay()];
}

export function toDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

export function getMonthWeekBlocks(anchor: Date) {
  const monthStart = startOfMonth(anchor);
  const monthEnd = endOfMonth(anchor);
  const blocks: { label: string; start: Date; end: Date }[] = [];
  let cursor = startOfWeek(monthStart);
  let weekIndex = 1;

  while (cursor <= monthEnd) {
    const blockStart = new Date(Math.max(cursor.getTime(), monthStart.getTime()));
    const weekEnd = endOfWeek(cursor);
    const blockEnd = new Date(Math.min(weekEnd.getTime(), monthEnd.getTime()));
    blocks.push({
      label: `Semana ${weekIndex}`,
      start: blockStart,
      end: blockEnd,
    });
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() + 7);
    weekIndex += 1;
  }

  return blocks;
}

export function isSameDay(a: Date, b: Date) {
  return toDateKey(a) === toDateKey(b);
}

export function isInRange(isoDate: string, from: Date, to: Date) {
  const date = new Date(isoDate);
  return date >= from && date <= to;
}
