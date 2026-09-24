"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { History, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getInitials, STATUS_LABELS } from "@/lib/kanban-utils";
import { LEAD_STATUS_LABELS } from "@/lib/leads-kanban-utils";
import { resolveMediaUrl } from "@/lib/media-url";
import { kanbanService } from "@/services";
import type { DeletionHistoryEntry, LeadStatus } from "@/services/types";
import { Input } from "../ui/input";

function formatDeletedAt(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function resolveStageLabel(entry: DeletionHistoryEntry) {
  const status = entry.metadata?.status;
  if (!status) return "Estágio não informado";

  if (entry.entityType === "LEAD") {
    return (
      LEAD_STATUS_LABELS[status as LeadStatus] ?? status.replaceAll("_", " ")
    );
  }

  const key = status.toLowerCase() as keyof typeof STATUS_LABELS;
  return STATUS_LABELS[key] ?? status.replaceAll("_", " ");
}

interface DeletionHistoryDrawerProps {
  entityFilter?: "KANBAN_TASK" | "LEAD" | "ALL";
  triggerLabel?: string;
}

export function DeletionHistoryDrawer({
  entityFilter = "ALL",
  triggerLabel = "Histórico de Exclusões",
}: DeletionHistoryDrawerProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DeletionHistoryEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const filteredItems = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return items;

    return items.filter((item) => {
      const titleMatches = item.title?.toLowerCase().includes(searchTerm);
      const userMatches = item.deletedBy.name
        .toLowerCase()
        .includes(searchTerm);
      const stageMatches = resolveStageLabel(item)
        .toLowerCase()
        .includes(searchTerm);

      return titleMatches || userMatches || stageMatches;
    });
  }, [items, search]);

  const loadHistory = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      try {
        const data = await kanbanService.getDeletionHistory({
          page: nextPage,
          limit: 30,
        });
        const filtered =
          entityFilter === "ALL"
            ? data.items
            : data.items.filter((item) => item.entityType === entityFilter);
        setItems(filtered);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [entityFilter],
  );

  useEffect(() => {
    if (!open) return;
    void loadHistory(1);
  }, [open, loadHistory]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button type="button" variant="outline" className="gap-2" />}
      >
        <History className="size-4" />
        {triggerLabel}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-[var(--atria-primary)]/10 bg-white sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="text-[var(--atria-primary)]">
            Histórico de Exclusões
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 my-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquise algo"
          />
        </div>

        <div className="flex flex-col gap-3 px-4 pb-6">
          {loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-[var(--atria-primary)]" />
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--atria-primary)]/50">
              Nenhuma exclusão registrada.
            </p>
          ) : (
            filteredItems.map((entry) => {
              const avatarSrc = resolveMediaUrl(entry.deletedBy.avatarUrl);
              return (
                <div
                  key={entry.id}
                  className="rounded-xl border border-[var(--atria-primary)]/10 bg-[var(--atria-primary)]/[0.02] p-3"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--atria-primary)]">
                        {entry.title || "Item removido"}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--atria-primary)]/50">
                        {formatDeletedAt(entry.deletedAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      {entry.entityType === "LEAD" ? "Lead" : "Tarefa"}
                    </Badge>
                  </div>

                  <p className="mb-3 text-xs text-[var(--atria-primary)]/65">
                    Estágio: {resolveStageLabel(entry)}
                  </p>

                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      {avatarSrc && (
                        <AvatarImage
                          src={avatarSrc}
                          alt={entry.deletedBy.name}
                        />
                      )}
                      <AvatarFallback className="bg-[var(--atria-accent)] text-[10px] font-semibold text-[var(--atria-primary)]">
                        {getInitials(entry.deletedBy.name)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-[var(--atria-primary)]/70">
                      Removido por {entry.deletedBy.name}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading || page <= 1}
                onClick={() => void loadHistory(page - 1)}
              >
                Anterior
              </Button>
              <span className="text-xs text-[var(--atria-primary)]/50">
                Página {page} de {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading || page >= totalPages}
                onClick={() => void loadHistory(page + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
