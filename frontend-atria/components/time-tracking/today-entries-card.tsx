"use client";

import type { TodayClockView } from "@/hooks/use-time-clock";
import { formatMinutesAsHours } from "@/lib/time-tracking/format";
import { cn } from "@/lib/utils";
import type {
  TimeClockEntry,
  TimeClockEntryType,
} from "@/services/time-tracking.service";

const DAILY_SLOTS: { entryType: TimeClockEntryType; label: string }[] = [
  { entryType: "CLOCK_IN", label: "Entrada" },
  { entryType: "BREAK_START", label: "Saída para almoço" },
  { entryType: "BREAK_END", label: "Volta do almoço" },
  { entryType: "CLOCK_OUT", label: "Saída" },
];

interface TodayEntriesCardProps {
  today: TodayClockView;
}

export function TodayEntriesCard({ today }: TodayEntriesCardProps) {
  const entryByType = new Map<TimeClockEntryType, TimeClockEntry>(
    today.entries.map((entry) => [entry.entryType, entry]),
  );

  return (
    <section className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
          Marcações de hoje
        </h2>
        <p className="text-sm text-[var(--atria-primary)]/60">
          Trabalhado:{" "}
          <strong className="text-[var(--atria-primary)]">
            {formatMinutesAsHours(today.workedMinutes)}
          </strong>
          {today.expectedMinutes > 0 &&
            ` de ${formatMinutesAsHours(today.expectedMinutes)}`}
        </p>
      </header>

      <ol className="flex flex-col gap-2">
        {DAILY_SLOTS.map((slot) => {
          const entry = entryByType.get(slot.entryType);
          const isNext = today.nextEntry?.entryType === slot.entryType;

          return (
            <li
              key={slot.entryType}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3",
                isNext
                  ? "border-[var(--atria-primary)]/40 bg-[var(--atria-primary)]/5"
                  : "border-[var(--atria-primary)]/10",
              )}
            >
              <div>
                <p className="font-medium text-[var(--atria-primary)]">
                  {slot.label}
                </p>
                {today.expected && (
                  <p className="text-xs text-[var(--atria-primary)]/50">
                    Previsto: {today.expected[slot.entryType]}
                  </p>
                )}
              </div>

              {entry ? (
                <div className="text-right">
                  <p className="text-lg font-semibold tabular-nums text-[var(--atria-primary)]">
                    {entry.time}
                  </p>
                  <p className="text-xs text-[var(--atria-primary)]/45">
                    NSR {entry.sequenceNumber}
                  </p>
                </div>
              ) : (
                <span className="text-sm text-[var(--atria-primary)]/40">
                  {isNext ? "Próxima" : "—"}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
