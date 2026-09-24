"use client";

import { CreationItemCard } from "@/components/creation/creation-item-card";
import {
  getMonthWeekBlocks,
  isInRange,
  toDateKey,
} from "@/lib/creation-date-utils";
import type { CreationPipelineItem } from "@/services/types";

interface CreationMonthViewProps {
  anchor: Date;
  items: CreationPipelineItem[];
  onInternalReview?: (
    item: CreationPipelineItem,
    status: "pending" | "approved" | "rejected",
  ) => void;
  onOpenTask?: (kanbanTaskId: string) => void;
  internalLoadingId?: string | null;
}

export function CreationMonthView({
  anchor,
  items,
  onInternalReview,
  onOpenTask,
  internalLoadingId,
}: CreationMonthViewProps) {
  const weekBlocks = getMonthWeekBlocks(anchor);

  const datedGroups = new Map<string, CreationPipelineItem[]>();
  for (const item of items) {
    const key = toDateKey(new Date(item.scheduledAt));
    const bucket = datedGroups.get(key) ?? [];
    bucket.push(item);
    datedGroups.set(key, bucket);
  }

  const hasWeekContent = weekBlocks.some((block) =>
    items.some((item) =>
      isInRange(item.scheduledAt, block.start, block.end),
    ),
  );

  if (!hasWeekContent && datedGroups.size === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--atria-primary)]/20 px-6 py-16 text-center">
        <p className="text-sm text-[var(--atria-primary)]/50">
          Nenhum item neste mês.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {weekBlocks.map((block) => {
        const blockItems = items
          .filter((item) =>
            isInRange(item.scheduledAt, block.start, block.end),
          )
          .sort(
            (a, b) =>
              new Date(a.scheduledAt).getTime() -
              new Date(b.scheduledAt).getTime(),
          );

        if (blockItems.length === 0) return null;

        const byDate = new Map<string, CreationPipelineItem[]>();
        for (const item of blockItems) {
          const key = toDateKey(new Date(item.scheduledAt));
          const bucket = byDate.get(key) ?? [];
          bucket.push(item);
          byDate.set(key, bucket);
        }

        return (
          <section key={block.label}>
            <h2 className="mb-4 text-sm font-semibold text-[var(--atria-primary)]">
              {block.label}
              <span className="ml-2 text-xs font-normal text-[var(--atria-primary)]/45">
                {block.start.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })}{" "}
                –{" "}
                {block.end.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </h2>

            <div className="flex flex-col gap-6">
              {Array.from(byDate.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([dateKey, dateItems]) => (
                  <div key={dateKey}>
                    <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--atria-primary)]/50">
                      {new Date(`${dateKey}T12:00:00`).toLocaleDateString(
                        "pt-BR",
                        { weekday: "short", day: "2-digit", month: "short" },
                      )}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {dateItems.map((item) => (
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
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
