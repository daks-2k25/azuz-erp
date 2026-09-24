import {
  DollarSign,
  Eye,
  Heart,
  MessageCircle,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { MetaAnalyticsSummary } from "@/services/types";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

interface MetaAnalyticsMetricCardsProps {
  data: MetaAnalyticsSummary;
}

export function MetaAnalyticsMetricCards({ data }: MetaAnalyticsMetricCardsProps) {
  const metrics = [
    {
      key: "totalSpend",
      label: "Investimento",
      value: formatCurrency(data.totalSpend),
      icon: DollarSign,
      highlight: true,
    },
    {
      key: "impressions",
      label: "Impressões",
      value: formatNumber(data.impressions),
      icon: Eye,
      highlight: false,
    },
    {
      key: "clicks",
      label: "Cliques",
      value: formatNumber(data.clicks),
      icon: MousePointerClick,
      highlight: false,
      subtitle: `CTR ${formatPercent(data.ctr)} · CPC ${formatCurrency(data.cpc)}`,
    },
    {
      key: "cpm",
      label: "CPM",
      value: formatCurrency(data.cpm),
      icon: TrendingUp,
      highlight: false,
    },
    {
      key: "messaging",
      label: "Conversas iniciadas",
      value: formatNumber(data.messagingConversations),
      icon: MessageCircle,
      highlight: true,
    },
    {
      key: "engagement",
      label: "Engajamento",
      value: formatNumber(data.postEngagement),
      icon: Heart,
      highlight: false,
      subtitle: `${formatNumber(data.linkClicks)} cliques no link`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.key}
            className={`rounded-2xl border p-5 ${
              metric.highlight
                ? "border-[var(--atria-accent)]/40 bg-[var(--atria-accent)]/10"
                : "border-[var(--atria-primary)]/10 bg-white"
            }`}
          >
            <div className="mb-3">
              <div
                className={`inline-flex rounded-xl p-2 ${
                  metric.highlight
                    ? "bg-[var(--atria-primary)] text-white"
                    : "bg-[var(--atria-accent)]/30 text-[var(--atria-primary)]"
                }`}
              >
                <Icon className="size-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-[var(--atria-primary)]">
              {metric.value}
            </p>
            <p className="text-xs text-[var(--atria-primary)]/60">
              {metric.label}
            </p>
            {metric.subtitle && (
              <p className="mt-1 text-[10px] text-[var(--atria-primary)]/45">
                {metric.subtitle}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
