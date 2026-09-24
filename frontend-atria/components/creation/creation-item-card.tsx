"use client";

import Link from "next/link";
import { ExternalLinkChip } from "@/components/ui/external-link-chip";
import { Button } from "@/components/ui/button";
import { TaskStatusBadge } from "@/components/kanban/task-status-select";
import type {
  CreationPipelineItem,
  CreationPipelineStatus,
  InternalReviewStatus,
} from "@/services/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<CreationPipelineStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
};

const INTERNAL_STYLES: Record<InternalReviewStatus, string> = {
  not_required: "bg-slate-50 text-slate-500",
  pending: "bg-orange-100 text-orange-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

const INTERNAL_LABELS: Record<InternalReviewStatus, string> = {
  not_required: "Sem revisão",
  pending: "Revisão interna",
  approved: "Aprovado interno",
  rejected: "Rejeitado interno",
};

interface CreationItemCardProps {
  item: CreationPipelineItem;
  onInternalReview?: (
    item: CreationPipelineItem,
    status: "pending" | "approved" | "rejected",
  ) => void;
  onOpenTask?: (kanbanTaskId: string) => void;
  internalLoading?: boolean;
  compact?: boolean;
}

export function CreationItemCard({
  item,
  onInternalReview,
  onOpenTask,
  internalLoading,
  compact,
}: CreationItemCardProps) {
  const time = new Date(item.scheduledAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-4 transition-shadow hover:shadow-sm",
        compact && "p-3",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-[var(--atria-primary)]/8 px-2 py-0.5 text-[10px] font-semibold text-[var(--atria-primary)]">
            {time}
          </span>
          {item.taskStatus ? (
            <TaskStatusBadge status={item.taskStatus} />
          ) : (
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                STATUS_STYLES[item.status],
              )}
            >
              {item.statusLabel}
            </span>
          )}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              INTERNAL_STYLES[item.internalReviewStatus],
            )}
          >
            {INTERNAL_LABELS[item.internalReviewStatus]}
          </span>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--atria-accent)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--atria-primary)]">
          {item.type}
        </span>
      </div>

      <div>
        {item.kanbanTaskId && onOpenTask ? (
          <button
            type="button"
            onClick={() => onOpenTask(item.kanbanTaskId!)}
            className="font-medium text-[var(--atria-primary)] hover:underline"
          >
            {item.title}
          </button>
        ) : (
          <Link
            href={item.href}
            className="font-medium text-[var(--atria-primary)] hover:underline"
          >
            {item.title}
          </Link>
        )}
        <p className="mt-0.5 text-xs text-[var(--atria-primary)]/45">
          {item.clientName}
        </p>
      </div>

      {item.referenceUrl && <ExternalLinkChip url={item.referenceUrl} />}

      {onInternalReview && (
        <div className="flex flex-wrap gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={
              internalLoading || item.internalReviewStatus !== "pending"
            }
            onClick={() => onInternalReview(item, "approved")}
          >
            Aprovar (Jhonatan)
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={internalLoading}
            onClick={() => onInternalReview(item, "rejected")}
          >
            Rejeitar
          </Button>
        </div>
      )}
    </div>
  );
}
