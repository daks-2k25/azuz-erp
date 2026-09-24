"use client";

import Link from "next/link";
import {
  AlertTriangle,
  FileWarning,
  Kanban,
  ShieldAlert,
} from "lucide-react";
import { LiquidGlassCard } from "@/components/creation/liquid-glass-card";
import type { CreationBlocker } from "@/services/types";

const BLOCKER_ICONS = {
  overdue_task: Kanban,
  missing_assets: FileWarning,
  unsigned_contract: ShieldAlert,
} as const;

const SEVERITY_STYLES = {
  red: {
    card: "border-red-200/60 bg-red-50/70",
    icon: "bg-red-100 text-red-600",
    badge: "bg-red-100 text-red-700",
  },
  amber: {
    card: "border-amber-200/60 bg-amber-50/70",
    icon: "bg-amber-100 text-amber-700",
    badge: "bg-amber-100 text-amber-800",
  },
} as const;

const BLOCKER_LABELS = {
  overdue_task: "Tarefa atrasada",
  missing_assets: "Assets faltando",
  unsigned_contract: "Contrato pendente",
} as const;

interface BlockersAlertsProps {
  blockers: CreationBlocker[];
}

export function BlockersAlerts({ blockers }: BlockersAlertsProps) {
  const redCount = blockers.filter((b) => b.severity === "red").length;
  const amberCount = blockers.filter((b) => b.severity === "amber").length;

  return (
    <LiquidGlassCard>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-red-500" />
          <div>
            <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
              Bloqueios & Alertas
            </h2>
            <p className="text-sm text-[var(--atria-primary)]/50">
              Itens que precisam de atenção imediata
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {redCount > 0 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
              {redCount} crítico{redCount !== 1 ? "s" : ""}
            </span>
          )}
          {amberCount > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
              {amberCount} atenção
            </span>
          )}
        </div>
      </div>

      {blockers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-green-200/60 bg-green-50/50 px-4 py-8 text-center text-sm text-green-700/70">
          Tudo em dia — nenhum bloqueio ativo.
        </div>
      ) : (
        <div className="flex max-h-[360px] flex-col gap-2 overflow-y-auto pr-1">
          {blockers.map((blocker) => {
            const Icon = BLOCKER_ICONS[blocker.type];
            const styles = SEVERITY_STYLES[blocker.severity];

            return (
              <Link
                key={blocker.id}
                href={blocker.href}
                className={`group flex items-start gap-3 rounded-xl border p-3 backdrop-blur-sm transition-opacity hover:opacity-90 ${styles.card}`}
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-[var(--atria-primary)] group-hover:underline">
                      {blocker.title}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles.badge}`}
                    >
                      {BLOCKER_LABELS[blocker.type]}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--atria-primary)]/60">
                    {blocker.description}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--atria-primary)]/40">
                    {blocker.clientName}
                    {blocker.dueDate
                      ? ` · ${new Date(blocker.dueDate).toLocaleDateString("pt-BR")}`
                      : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </LiquidGlassCard>
  );
}
