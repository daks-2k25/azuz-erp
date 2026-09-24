"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContentStatusBadge } from "@/components/content/content-status-badge";
import { LiquidGlassCard } from "@/components/creation/liquid-glass-card";
import type {
  ContentPostFormat,
  ContentPostStatus,
  CreationDeliverableGroup,
} from "@/services/types";

const FORMAT_LABELS: Record<ContentPostFormat, string> = {
  carousel: "Carrossel",
  reels: "Reels",
  static: "Estático",
  story: "Story",
};

const FORMAT_FILTERS: Array<ContentPostFormat | "all"> = [
  "all",
  "reels",
  "carousel",
  "static",
];

const STATUS_FILTERS: Array<{ id: string; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "draft", label: "Rascunho" },
  { id: "pending_approval", label: "Em Aprovação" },
  { id: "approved", label: "Aprovado" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatWeekRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  return `${fmt(s)} – ${fmt(e)}`;
}

interface DeliverablesGridProps {
  groups: CreationDeliverableGroup[];
  weekRange: { start: string; end: string };
  summary: {
    total: number;
    byFormat: Record<string, number>;
    byStatus: Record<string, number>;
  };
}

export function DeliverablesGrid({
  groups,
  weekRange,
  summary,
}: DeliverablesGridProps) {
  const [formatFilter, setFormatFilter] = useState<ContentPostFormat | "all">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const formatMatch =
            formatFilter === "all" ||
            item.format === formatFilter ||
            (formatFilter === "static" && item.type === "task");
          const statusMatch =
            statusFilter === "all" || item.status === statusFilter;
          return formatMatch && statusMatch;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, formatFilter, statusFilter]);

  return (
    <LiquidGlassCard className="col-span-full xl:col-span-2">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
            Entregas da Semana
          </h2>
          <p className="text-sm text-[var(--atria-primary)]/50">
            {formatWeekRange(weekRange.start, weekRange.end)} · {summary.total}{" "}
            itens
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FORMAT_FILTERS.map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => setFormatFilter(format)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                formatFilter === format
                  ? "bg-[var(--atria-primary)] text-white"
                  : "bg-white/60 text-[var(--atria-primary)] hover:bg-white/80"
              }`}
            >
              {format === "all" ? "Todos" : FORMAT_LABELS[format]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status.id}
            type="button"
            onClick={() => setStatusFilter(status.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === status.id
                ? "bg-[var(--atria-accent)] text-[var(--atria-primary)]"
                : "bg-white/40 text-[var(--atria-primary)]/70 hover:bg-white/60"
            }`}
          >
            {status.label}
            {status.id !== "all" && summary.byStatus[status.id]
              ? ` (${summary.byStatus[status.id]})`
              : ""}
          </button>
        ))}
      </div>

      {filteredGroups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--atria-primary)]/15 bg-white/30 px-4 py-10 text-center text-sm text-[var(--atria-primary)]/50">
          Nenhuma entrega encontrada para os filtros selecionados.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredGroups.map((group) => (
            <div
              key={group.clientId}
              className="rounded-xl border border-white/30 bg-white/40 p-4 backdrop-blur-sm"
            >
              <div className="mb-3 flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage src={group.avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-[var(--atria-primary)]/10 text-xs text-[var(--atria-primary)]">
                    {getInitials(group.clientName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-[var(--atria-primary)]">
                    {group.clientName}
                  </p>
                  <p className="text-[10px] text-[var(--atria-primary)]/50">
                    {group.items.length} entrega
                    {group.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={
                      item.type === "post"
                        ? `/content/${item.id}`
                        : "/kanban"
                    }
                    className="group flex items-center justify-between gap-2 rounded-lg border border-white/40 bg-white/50 px-3 py-2 transition-colors hover:bg-white/80"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--atria-primary)] group-hover:underline">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-[var(--atria-primary)]/50">
                        {item.type === "post" && item.format
                          ? FORMAT_LABELS[item.format]
                          : item.columnTitle ?? "Tarefa"}
                        {item.dueDate
                          ? ` · ${new Date(item.dueDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`
                          : ""}
                      </p>
                    </div>
                    {item.type === "post" &&
                    [
                      "draft",
                      "pending_approval",
                      "approved",
                      "rejected",
                      "scheduled",
                      "published",
                    ].includes(item.status) ? (
                      <ContentStatusBadge
                        status={item.status as ContentPostStatus}
                      />
                    ) : (
                      <span className="shrink-0 rounded-full bg-[var(--atria-primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--atria-primary)]">
                        {item.priority ?? "tarefa"}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </LiquidGlassCard>
  );
}
