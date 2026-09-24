"use client";

import { Megaphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MetaCampaignInsight, MetaCampaignStatus } from "@/services/types";

const STATUS_STYLES: Record<MetaCampaignStatus, string> = {
  active: "bg-green-100 text-green-700",
  paused: "bg-amber-100 text-amber-700",
  completed: "bg-gray-100 text-gray-600",
  learning: "bg-blue-100 text-blue-700",
  unknown: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<MetaCampaignStatus, string> = {
  active: "Ativa",
  paused: "Pausada",
  completed: "Concluída",
  learning: "Em processo",
  unknown: "—",
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

interface MetaCampaignsTableProps {
  campaigns: MetaCampaignInsight[];
  loading?: boolean;
}

export function MetaCampaignsTable({
  campaigns,
  loading = false,
}: MetaCampaignsTableProps) {
  if (loading) {
    return (
      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
        <Skeleton className="mb-4 h-5 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--atria-primary)]/20 bg-white px-6 py-10 text-center">
        <div className="rounded-full bg-[var(--atria-accent)]/20 p-3 text-[var(--atria-primary)]">
          <Megaphone className="size-5" />
        </div>
        <p className="font-semibold text-[var(--atria-primary)]">
          Nenhuma campanha encontrada
        </p>
        <p className="text-sm text-[var(--atria-primary)]/50">
          Não há campanhas ativas ou com entrega no período selecionado.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-[var(--atria-primary)]/10 bg-white">
      <div className="border-b border-[var(--atria-primary)]/8 px-4 py-3">
        <h4 className="text-sm font-semibold text-[var(--atria-primary)]">
          Campanhas ({campaigns.length})
        </h4>
        <p className="text-xs text-[var(--atria-primary)]/50">
          Alcance, frequência, investimento e performance no período
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--atria-primary)]/5 text-left text-[var(--atria-primary)]/60">
            <tr>
              <th className="px-4 py-3 font-medium">Campanha</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Orçamento</th>
              <th className="px-4 py-3 font-medium">Investimento</th>
              <th className="px-4 py-3 font-medium">Alcance</th>
              <th className="px-4 py-3 font-medium">Frequência</th>
              <th className="px-4 py-3 font-medium">Impressões</th>
              <th className="px-4 py-3 font-medium">Cliques</th>
              <th className="px-4 py-3 font-medium">CTR</th>
              <th className="px-4 py-3 font-medium">CPC</th>
              <th className="px-4 py-3 font-medium">Conversões</th>
              <th className="px-4 py-3 font-medium">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-t border-[var(--atria-primary)]/8 hover:bg-[var(--atria-accent)]/10"
              >
                <td className="max-w-[16rem] px-4 py-3">
                  <p className="truncate font-medium text-[var(--atria-primary)]">
                    {campaign.name}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[campaign.status]}`}
                  >
                    {STATUS_LABELS[campaign.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                  {campaign.budget > 0 ? (
                    <>
                      {formatCurrency(campaign.budget)}
                      <span className="text-xs text-[var(--atria-primary)]/40">
                        /{campaign.budgetType === "daily" ? "dia" : "total"}
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-[var(--atria-primary)]">
                  {formatCurrency(campaign.spend)}
                </td>
                <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                  {formatNumber(campaign.reach)}
                </td>
                <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                  {campaign.frequency > 0
                    ? campaign.frequency.toFixed(2)
                    : "—"}
                </td>
                <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                  {formatNumber(campaign.impressions)}
                </td>
                <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                  {formatNumber(campaign.clicks)}
                </td>
                <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                  {campaign.ctr.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                  {formatCurrency(campaign.cpc)}
                </td>
                <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                  {formatNumber(campaign.conversions)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-medium ${
                      campaign.roas >= 3
                        ? "text-green-700"
                        : "text-[var(--atria-primary)]"
                    }`}
                  >
                    {campaign.roas > 0 ? `${campaign.roas.toFixed(1)}x` : "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
