"use client";

import { BarChart3, Eye, Heart, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ClientInsights } from "@/services/types";

interface ClientInsightsCardProps {
  insights: ClientInsights;
}

export function ClientInsightsCard({ insights }: ClientInsightsCardProps) {
  const items = [
    { label: "Alcance", value: insights.reach.toLocaleString("pt-BR"), icon: Users },
    {
      label: "Impressões",
      value: insights.impressions.toLocaleString("pt-BR"),
      icon: Eye,
    },
    {
      label: "Engajamento",
      value: insights.engagement.toLocaleString("pt-BR"),
      icon: Heart,
    },
    {
      label: "Taxa",
      value: `${insights.engagementRate}%`,
      icon: BarChart3,
    },
  ];

  return (
    <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-[var(--atria-primary)]">
          Meta / Instagram — Este mês
        </h3>
        <span className="text-xs text-[var(--atria-primary)]/40">
          R$ {insights.spend.toLocaleString("pt-BR")} investidos
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-[var(--atria-accent)]/10 p-3"
          >
            <div className="mb-1 flex items-center gap-1.5 text-[var(--atria-primary)]/50">
              <item.icon className="size-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wide">
                {item.label}
              </span>
            </div>
            <p className="text-lg font-bold text-[var(--atria-primary)]">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
