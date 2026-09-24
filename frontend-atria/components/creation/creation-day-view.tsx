"use client";

import { CreationItemCard } from "@/components/creation/creation-item-card";
import { isSameDay } from "@/lib/creation-date-utils";
import type { CreationPipelineItem } from "@/services/types";

interface CreationDayViewProps {
  anchor: Date;
  items: CreationPipelineItem[];
  onInternalReview?: (
    item: CreationPipelineItem,
    status: "pending" | "approved" | "rejected",
  ) => void;
  onOpenTask?: (kanbanTaskId: string) => void;
  internalLoadingId?: string | null;
}

export function CreationDayView({
  anchor,
  items,
  onInternalReview,
  onOpenTask,
  internalLoadingId,
}: CreationDayViewProps) {
  const dayItems = items
    .filter((item) => isSameDay(new Date(item.scheduledAt), anchor))
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );

  if (dayItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--atria-primary)]/20 px-6 py-16 text-center">
        <p className="text-sm text-[var(--atria-primary)]/50">
          Nenhum item agendado para este dia.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {dayItems.map((item) => (
        <CreationItemCard
          key={`${item.source}-${item.id}`}
          item={item}
          onInternalReview={onInternalReview}
          onOpenTask={onOpenTask}
          internalLoading={internalLoadingId === `${item.source}-${item.id}`}
        />
      ))}
    </div>
  );
}
