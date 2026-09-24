"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { LiquidGlassCard } from "@/components/creation/liquid-glass-card";
import type { CreationCommandCenter } from "@/services/types";

interface CreationStatsRowProps {
  stats: CreationCommandCenter["stats"];
}

const STAT_CARDS = [
  {
    key: "deliverablesThisWeek" as const,
    label: "Entregas esta semana",
    icon: Layers,
    color: "text-[var(--atria-primary)]",
    bg: "bg-[var(--atria-primary)]/10",
  },
  {
    key: "pendingApprovals" as const,
    label: "Aguardando aprovação",
    icon: CheckCircle2,
    color: "text-amber-700",
    bg: "bg-amber-100",
  },
  {
    key: "scheduledReleases" as const,
    label: "Publicações agendadas",
    icon: Calendar,
    color: "text-violet-700",
    bg: "bg-violet-100",
  },
  {
    key: "activeBlockers" as const,
    label: "Bloqueios ativos",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
];

export function CreationStatsRow({ stats }: CreationStatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {STAT_CARDS.map((card) => (
        <LiquidGlassCard key={card.key} className="!p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-xl ${card.bg}`}
            >
              <card.icon className={`size-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--atria-primary)]">
                {stats[card.key]}
              </p>
              <p className="text-[11px] leading-tight text-[var(--atria-primary)]/50">
                {card.label}
              </p>
            </div>
          </div>
        </LiquidGlassCard>
      ))}
    </div>
  );
}
