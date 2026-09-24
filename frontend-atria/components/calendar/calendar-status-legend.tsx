"use client";

import { STATUS_COLORS, STATUS_LABELS, STATUS_ORDER } from "@/lib/kanban-utils";
import {
  PRODUCTION_PHASE_DEFINITIONS,
} from "@/lib/production-phase";
import { cn } from "@/lib/utils";

export function CalendarStatusLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--atria-primary)]/10 bg-[var(--atria-primary)]/[0.02] px-3 py-2.5",
        className,
      )}
    >
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--atria-primary)]/45">
        Legenda de status
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {STATUS_ORDER.flatMap((status) => {
          if (status === "falta_gravar") {
            return PRODUCTION_PHASE_DEFINITIONS.map((phase) => (
              <div
                key={phase.phase}
                className="flex items-center gap-1.5 text-xs text-[var(--atria-primary)]/80"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full ring-1 ring-black/5"
                  style={{ backgroundColor: phase.color }}
                />
                <span className="font-medium">
                  {STATUS_LABELS[status]} · {phase.label}
                </span>
              </div>
            ));
          }

          return (
            <div
              key={status}
              className="flex items-center gap-1.5 text-xs text-[var(--atria-primary)]/80"
            >
              <span
                className="size-2.5 shrink-0 rounded-full ring-1 ring-black/5"
                style={{ backgroundColor: STATUS_COLORS[status] }}
              />
              <span className="font-medium">{STATUS_LABELS[status]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
