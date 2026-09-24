"use client";

import Link from "next/link";
import { AlertCircle, Kanban } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LiquidGlassCard } from "@/components/creation/liquid-glass-card";
import { ExternalLinkChip } from "@/components/ui/external-link-chip";
import type { Client360Tasks } from "@/services/types";
import { resolveMediaUrl } from "@/lib/media-url";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ClientOpenTasksProps {
  data: Client360Tasks;
}

export function ClientOpenTasks({ data }: ClientOpenTasksProps) {
  return (
    <LiquidGlassCard className="h-fit">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Kanban className="size-5 text-[var(--atria-primary)]" />
          <div>
            <h2 className="text-base font-semibold text-[var(--atria-primary)]">
              Tarefas Kanban
            </h2>
            <p className="text-[11px] text-[var(--atria-primary)]/50">
              {data.tasks.length} em aberto
            </p>
          </div>
        </div>
        <Link
          href="/kanban"
          className="text-xs font-medium text-[var(--atria-primary)]/60 hover:underline"
        >
          Abrir quadro
        </Link>
      </div>

      {data.tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--atria-primary)]/15 bg-white/30 px-4 py-6 text-center text-sm text-[var(--atria-primary)]/50">
          Nenhuma tarefa aberta para este cliente.
        </p>
      ) : (
        <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pr-1">
          {data.tasks.map((task) => (
            <Link
              key={task.id}
              href="/kanban"
              className="rounded-xl border border-white/40 bg-white/50 p-3 transition-colors hover:bg-white/80"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-[var(--atria-primary)]">
                  {task.title}
                </p>
                {task.isOverdue && (
                  <AlertCircle className="size-4 shrink-0 text-red-500" />
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                  style={{ backgroundColor: task.column.color }}
                >
                  {task.column.title}
                </span>
                {task.dueDate && (
                  <span
                    className={`text-[10px] ${task.isOverdue ? "font-semibold text-red-600" : "text-[var(--atria-primary)]/40"}`}
                  >
                    {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
              {task.referenceUrl && (
                <div className="mt-2">
                  <ExternalLinkChip url={task.referenceUrl} />
                </div>
              )}
              {task.assignees.length > 0 && (
                <div className="mt-2 flex -space-x-2">
                  {task.assignees.slice(0, 3).map((user) => (
                    <Avatar key={user.id} className="size-6 border-2 border-white">
                      <AvatarImage src={resolveMediaUrl(user.avatarUrl) ?? undefined} />
                      <AvatarFallback className="text-[8px]">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </LiquidGlassCard>
  );
}
