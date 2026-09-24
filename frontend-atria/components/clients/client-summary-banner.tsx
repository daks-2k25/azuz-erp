"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupBadge } from "@/components/ui/group-badge";
import { LIQUID_GLASS_CLASS } from "@/lib/content-utils";
import type { Client360Summary, ClientHealthStatus } from "@/services/types";
import { ClientName } from "@/components/ui/client-name";
import { cn } from "@/lib/utils";

const HEALTH_CONFIG: Record<
  ClientHealthStatus,
  { label: string; color: string; dot: string }
> = {
  healthy: {
    label: "Saudável",
    color: "text-green-700",
    dot: "bg-green-500",
  },
  attention: {
    label: "Atenção",
    color: "text-amber-700",
    dot: "bg-amber-500",
  },
  at_risk: {
    label: "Em risco",
    color: "text-red-700",
    dot: "bg-red-500",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface ClientSummaryBannerProps {
  data: Client360Summary;
}

export function ClientSummaryBanner({ data }: ClientSummaryBannerProps) {
  const health = HEALTH_CONFIG[data.health];
  const { client, metrics } = data;

  return (
    <div
      className={cn(
        LIQUID_GLASS_CLASS,
        "relative overflow-hidden p-6 sm:p-8",
      )}
    >
      <div
        className="pointer-events-none absolute -top-16 right-0 size-48 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--atria-accent)" }}
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="size-16 border-2 border-white/60 shadow-md sm:size-20">
            <AvatarImage src={client.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-[var(--atria-accent)] text-lg font-bold text-[var(--atria-primary)]">
              {getInitials(client.companyName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <ClientName
                as="h1"
                className="text-2xl text-[var(--atria-primary)] sm:text-3xl"
              >
                {client.companyName}
              </ClientName>
              <div className="flex items-center gap-1.5 rounded-full bg-white/60 px-2.5 py-1 text-xs font-semibold">
                <span className={cn("size-2 rounded-full", health.dot)} />
                <span className={health.color}>{health.label}</span>
              </div>
            </div>
            {client.contactName && (
              <p className="text-sm text-[var(--atria-primary)]/60">
                {client.contactName}
              </p>
            )}
            {client.clientGroup && (
              <div className="mt-2">
                <GroupBadge
                  name={client.clientGroup.name}
                  color={client.clientGroup.color}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          <MetricPill
            label="MRR"
            value={formatCurrency(metrics.mrr)}
            highlight
          />
          <MetricPill
            label="Contratos ativos"
            value={String(metrics.activeContractsCount)}
          />
          <MetricPill
            label="Posts agendados"
            value={String(metrics.scheduledPosts)}
          />
          <MetricPill
            label="Tarefas abertas"
            value={String(metrics.openTasks)}
          />
        </div>
      </div>
    </div>
  );
}

function MetricPill({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2.5 backdrop-blur-sm",
        highlight
          ? "border-[var(--atria-accent)]/40 bg-[var(--atria-accent)]/20"
          : "border-white/40 bg-white/50",
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--atria-primary)]/50">
        {label}
      </p>
      <p className="text-sm font-bold text-[var(--atria-primary)] sm:text-base">
        {value}
      </p>
    </div>
  );
}
