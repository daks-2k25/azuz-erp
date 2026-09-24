"use client";

import { ClientName } from "@/components/ui/client-name";
import { cn } from "@/lib/utils";
import type { InternalApprovalItem } from "@/services/types";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface InternalApprovalListItemProps {
  item: InternalApprovalItem;
  selected: boolean;
  onSelect: () => void;
}

export function InternalApprovalListItem({
  item,
  selected,
  onSelect,
}: InternalApprovalListItemProps) {
  const deliveryCount = item.assetCount || item.revisionSummary.total;

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
      {item.client ? (
        <ClientName className="text-xs text-[var(--atria-primary)]/70">
          {item.client.companyName}
        </ClientName>
      ) : (
        <p className="text-xs font-medium text-[var(--atria-primary)]/45">
          Sem cliente
        </p>
      )}
      <p className="mt-1 font-semibold text-[var(--atria-primary)] line-clamp-2">
        {item.title}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--atria-primary)]/55">
        <span>Pub. {formatDate(item.publicationDate)}</span>
        <span>{deliveryCount} entrega{deliveryCount === 1 ? "" : "s"}</span>
      </div>
    </button>
  );
}
