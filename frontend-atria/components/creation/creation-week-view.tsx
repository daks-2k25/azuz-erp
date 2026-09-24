"use client";

import { CreationItemCard } from "@/components/creation/creation-item-card";
import {
  getWeekDays,
  getWeekdayLabel,
  isSameDay,
  toDateKey,
} from "@/lib/creation-date-utils";
import { cn } from "@/lib/utils";
import type { CreationPipelineItem } from "@/services/types";

interface CreationWeekViewProps {
  anchor: Date;
  items: CreationPipelineItem[];
  onInternalReview?: (
    item: CreationPipelineItem,
    status: "pending" | "approved" | "rejected",
  ) => void;
  onOpenTask?: (kanbanTaskId: string) => void;
  internalLoadingId?: string | null;
}

export function CreationWeekView({
  anchor,
  items,
  onInternalReview,
  onOpenTask,
  internalLoadingId,
}: CreationWeekViewProps) {
  const days = getWeekDays(anchor);
  const todayKey = toDateKey(new Date());

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-7">
      {days.map((day) => {
        const dayKey = toDateKey(day);
        const dayItems = items
          .filter((item) => isSameDay(new Date(item.scheduledAt), day))
          .sort(
            (a, b) =>
              new Date(a.scheduledAt).getTime() -
              new Date(b.scheduledAt).getTime(),
          );

        return (
          <div
            key={dayKey}
            className={cn(
              "flex min-h-[200px] flex-col rounded-2xl border bg-white/70 p-3",
              dayKey === todayKey
                ? "border-[var(--atria-accent)] bg-[var(--atria-accent)]/10"
                : "border-[var(--atria-primary)]/10",
            )}
          >
            <div className="mb-3 border-b border-[var(--atria-primary)]/10 pb-2">
              <p className="text-xs font-semibold text-[var(--atria-primary)]">
                {getWeekdayLabel(day, true)}
              </p>
              <p className="text-[10px] text-[var(--atria-primary)]/45">
                {day.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })}
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {dayItems.length === 0 ? (
                <p className="text-[10px] text-[var(--atria-primary)]/35">
                  Sem itens
                </p>
              ) : (
                dayItems.map((item) => (
                  <CreationItemCard
                    key={`${item.source}-${item.id}`}
                    item={item}
                    compact
                    onInternalReview={onInternalReview}
                    onOpenTask={onOpenTask}
                    internalLoading={
                      internalLoadingId === `${item.source}-${item.id}`
                    }
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
