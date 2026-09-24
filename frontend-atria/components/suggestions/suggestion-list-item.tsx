"use client";

import { Bug, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/native-select";
import {
  SUGGESTION_STATUS_LABELS,
  SUGGESTION_STATUS_OPTIONS,
  SUGGESTION_TYPE_LABELS,
} from "@/lib/suggestion-labels";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { useSuggestionMutations } from "@/hooks/use-suggestions";
import type { SystemSuggestion, SystemSuggestionStatus } from "@/services/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusVariant(
  status: SystemSuggestionStatus,
): "default" | "warning" | "success" | "secondary" {
  switch (status) {
    case "OPEN":
      return "warning";
    case "IN_PROGRESS":
      return "default";
    case "RESOLVED":
      return "success";
    case "CLOSED":
      return "secondary";
    default:
      return "secondary";
  }
}

interface SuggestionListItemProps {
  suggestion: SystemSuggestion;
  showAuthor?: boolean;
  canManageStatus?: boolean;
}

export function SuggestionListItem({
  suggestion,
  showAuthor = false,
  canManageStatus = false,
}: SuggestionListItemProps) {
  const { updateStatus } = useSuggestionMutations();
  const TypeIcon = suggestion.type === "BUG" ? Bug : Lightbulb;

  return (
    <article className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div
            className={cn(
              "rounded-xl p-2",
              suggestion.type === "BUG"
                ? "bg-red-50 text-red-600"
                : "bg-amber-50 text-amber-600",
            )}
          >
            <TypeIcon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-[var(--atria-primary)]">
                {suggestion.title}
              </h3>
              <Badge variant="outline">
                {SUGGESTION_TYPE_LABELS[suggestion.type]}
              </Badge>
            </div>
            {showAuthor ? (
              <p className="mt-1 text-xs text-[var(--atria-primary)]/50">
                Por {suggestion.submittedBy.name} ·{" "}
                {formatDate(suggestion.createdAt)}
              </p>
            ) : (
              <p className="mt-1 text-xs text-[var(--atria-primary)]/50">
                {formatDate(suggestion.createdAt)}
              </p>
            )}
          </div>
        </div>

        {canManageStatus ? (
          <NativeSelect
            value={suggestion.status}
            onChange={(event) => {
              const status = event.target.value as SystemSuggestionStatus;
              if (status !== suggestion.status) {
                void updateStatus
                  .mutateAsync({ id: suggestion.id, status })
                  .then(() => toast.success("Status atualizado."))
                  .catch(() => toast.error("Não foi possível atualizar o status."));
              }
            }}
            disabled={updateStatus.isPending}
            className="w-auto min-w-[10rem]"
          >
            {SUGGESTION_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {SUGGESTION_STATUS_LABELS[status]}
              </option>
            ))}
          </NativeSelect>
        ) : (
          <Badge variant={statusVariant(suggestion.status)}>
            {SUGGESTION_STATUS_LABELS[suggestion.status]}
          </Badge>
        )}
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--atria-primary)]/75">
        {suggestion.description}
      </p>
    </article>
  );
}
