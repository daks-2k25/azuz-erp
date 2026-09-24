import type { SlaUiStatus } from "@/services/types";
import { cn } from "@/lib/utils";

const LABELS: Record<SlaUiStatus, string> = {
  not_tracked: "Sem SLA",
  ok: "SLA OK",
  approaching_response: "Resposta em risco",
  response_breached: "Resposta violada",
  approaching_resolution: "Resolução em risco",
  resolution_breached: "SLA violado",
  met: "SLA cumprido",
};

const STYLES: Record<SlaUiStatus, string> = {
  not_tracked: "bg-slate-100 text-slate-600",
  ok: "bg-emerald-100 text-emerald-800",
  approaching_response: "bg-amber-100 text-amber-800",
  response_breached: "bg-red-100 text-red-800",
  approaching_resolution: "bg-orange-100 text-orange-800",
  resolution_breached: "bg-red-100 text-red-800",
  met: "bg-emerald-100 text-emerald-800",
};

export function SlaStatusBadge({
  status,
  className,
}: {
  status: SlaUiStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
        STYLES[status],
        className,
      )}
    >
      {LABELS[status]}
    </span>
  );
}

export function formatSlaDue(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
