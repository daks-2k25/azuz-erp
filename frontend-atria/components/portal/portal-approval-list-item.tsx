"use client";

import { cn } from "@/lib/utils";
import { FORMAT_LABELS, PLATFORM_LABELS } from "@/lib/report-utils";
import type { ContentPostStatus, PortalContentPipelineItem } from "@/services/types";

const STATUS_BADGES: Partial<
  Record<ContentPostStatus, { label: string; className: string }>
> = {
  pending_approval: {
    label: "Em aprovação",
    className: "bg-amber-100 text-amber-800",
  },
  rejected: {
    label: "Solicitado Ajuste",
    className: "bg-red-100 text-red-800",
  },
  approved: {
    label: "Aprovado",
    className: "bg-emerald-100 text-emerald-800",
  },
  scheduled: {
    label: "Agendado",
    className: "bg-blue-100 text-blue-800",
  },
  published: {
    label: "Publicado",
    className: "bg-zinc-100 text-zinc-700",
  },
};

interface PortalApprovalListItemProps {
  post: PortalContentPipelineItem;
  selected: boolean;
  onSelect: () => void;
}

export function PortalApprovalListItem({
  post,
  selected,
  onSelect,
}: PortalApprovalListItemProps) {
  const badge = STATUS_BADGES[post.status];
  const mediaCount = post.attachments?.length ?? 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition",
        selected
          ? "border-[var(--atria-primary)] bg-[var(--atria-accent)]/25 shadow-sm"
          : "border-[var(--atria-primary)]/10 bg-white hover:border-[var(--atria-primary)]/25 hover:bg-[var(--atria-primary)]/[0.03]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-[var(--atria-primary)] line-clamp-2">
          {post.title}
        </p>
        {badge && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              badge.className,
            )}
          >
            {badge.label}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--atria-primary)]/55">
        <span>
          {PLATFORM_LABELS[post.platform]} · {FORMAT_LABELS[post.format]}
        </span>
        {post.scheduledDate && (
          <span>
            {new Date(post.scheduledDate).toLocaleDateString("pt-BR")}
          </span>
        )}
        {mediaCount > 0 && (
          <span>
            {mediaCount} mídia{mediaCount === 1 ? "" : "s"}
          </span>
        )}
      </div>
      {post.copy && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--atria-primary)]/65">
          {post.copy}
        </p>
      )}
    </button>
  );
}
