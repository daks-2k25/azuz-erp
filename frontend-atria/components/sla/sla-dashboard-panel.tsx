"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { SlaStatusBadge, formatSlaDue } from "@/components/sla/sla-status-badge";
import { slaService } from "@/services";
import type { SlaDashboard } from "@/services/sla.service";

export function SlaDashboardPanel() {
  const [data, setData] = useState<SlaDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const dashboard = await slaService.getSlaDashboard();
      setData(dashboard);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
        <div className="size-7 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="size-5 text-[var(--atria-primary)]" />
        <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
          Monitoramento SLA
        </h2>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Tarefas abertas" value={data.summary.openTasks} />
        <SummaryCard label="Solicitações" value={data.summary.openBriefs} />
        <SummaryCard
          label="Em risco"
          value={data.summary.atRiskCount}
          highlight="amber"
        />
        <SummaryCard
          label="Violados"
          value={data.summary.breachedCount}
          highlight="red"
        />
      </div>

      {(data.breached.length > 0 || data.atRisk.length > 0) && (
        <div className="space-y-4">
          {data.breached.length > 0 && (
            <section>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-red-700">
                <AlertTriangle className="size-4" />
                SLA violado
              </h3>
              <div className="space-y-2">
                {data.breached.slice(0, 8).map((item) => (
                  <SlaItemRow key={`${item.type}-${item.id}`} item={item} />
                ))}
              </div>
            </section>
          )}

          {data.atRisk.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-medium text-amber-700">
                Próximo do limite
              </h3>
              <div className="space-y-2">
                {data.atRisk.slice(0, 6).map((item) => (
                  <SlaItemRow key={`${item.type}-${item.id}`} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {data.breached.length === 0 && data.atRisk.length === 0 && (
        <p className="text-sm text-[var(--atria-primary)]/50">
          Nenhum item com SLA em risco ou violado no momento.
        </p>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: "amber" | "red";
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight === "red"
          ? "border-red-200 bg-red-50"
          : highlight === "amber"
            ? "border-amber-200 bg-amber-50"
            : "border-[var(--atria-primary)]/10 bg-[var(--atria-primary)]/3"
      }`}
    >
      <p className="text-xs text-[var(--atria-primary)]/55">{label}</p>
      <p className="text-2xl font-bold text-[var(--atria-primary)]">{value}</p>
    </div>
  );
}

function SlaItemRow({ item }: { item: SlaDashboard["breached"][number] }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--atria-primary)]/10 px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[var(--atria-primary)]">
          {item.title}
        </p>
        <p className="text-xs text-[var(--atria-primary)]/50">
          {item.type === "task" ? "Tarefa" : "Solicitação"} ·{" "}
          {item.clientName ?? "Sem cliente"} · Resolução:{" "}
          {formatSlaDue(item.slaResolutionDueAt)}
        </p>
      </div>
      <SlaStatusBadge status={item.slaStatus} />
    </div>
  );
}
