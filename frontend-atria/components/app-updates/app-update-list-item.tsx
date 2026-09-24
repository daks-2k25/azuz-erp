"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatAppUpdateRoles } from "@/lib/app-updates";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import {
  useAppUpdateMutations,
  useMarkAppUpdateAsRead,
} from "@/hooks/use-app-updates";
import { useNotifications } from "@/contexts/notifications-context";
import type { AppUpdate } from "@/services/types";

interface AppUpdateListItemProps {
  update: AppUpdate;
  canManage?: boolean;
  onEdit?: (update: AppUpdate) => void;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AppUpdateListItem({
  update,
  canManage = false,
  onEdit,
}: AppUpdateListItemProps) {
  const { remove } = useAppUpdateMutations();
  const markAsRead = useMarkAppUpdateAsRead();
  const { refresh: refreshNotifications } = useNotifications();

  async function handleMarkAsRead() {
    try {
      await markAsRead.mutateAsync(update.id);
      await refreshNotifications();
      toast.success("Atualização marcada como lida.");
    } catch {
      toast.error("Não foi possível marcar como lida.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Excluir esta atualização?")) return;

    try {
      await remove.mutateAsync(update.id);
      toast.success("Atualização excluída.");
    } catch {
      toast.error("Não foi possível excluir.");
    }
  }

  return (
    <article
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-sm",
        update.isRead
          ? "border-[var(--atria-primary)]/10"
          : "border-[var(--atria-accent)]/40 bg-[var(--atria-accent)]/8",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-[var(--atria-primary)]">
              {update.title}
            </h3>
            {!update.isPublished ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                Rascunho
              </span>
            ) : null}
            {!update.isRead && update.isPublished ? (
              <span className="rounded-full bg-[var(--atria-accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--atria-primary)]">
                Nova
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-[var(--atria-primary)]/45">
            {formatDate(update.createdAt)}
            {canManage ? ` · por ${update.createdBy.name}` : null}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {!update.isRead && update.isPublished ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5"
              disabled={markAsRead.isPending}
              onClick={() => void handleMarkAsRead()}
            >
              <Check className="size-3.5" />
              Marcar como lida
            </Button>
          ) : null}
          {canManage ? (
            <>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => onEdit?.(update)}
                aria-label="Editar atualização"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => void handleDelete()}
                disabled={remove.isPending}
                aria-label="Excluir atualização"
              >
                <Trash2 className="size-4 text-red-500" />
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--atria-primary)]/80",
        )}
      >
        {update.body}
      </div>

      {canManage ? (
        <p className="mt-4 text-xs text-[var(--atria-primary)]/45">
          Visível para: {formatAppUpdateRoles(update.visibleRoles)}
        </p>
      ) : null}
    </article>
  );
}
