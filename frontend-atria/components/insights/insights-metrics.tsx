import {
  Eye,
  BarChart3,
  DollarSign,
  TrendingUp,
  Heart,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { MetaInsightsOverview } from "@/services/types";

const PRIMARY = "#004949";
const ACCENT = "#E8C39E";

function formatNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString("pt-BR");
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface InsightsMetricsProps {
  overview: MetaInsightsOverview;
}

export function InsightsMetrics({ overview }: InsightsMetricsProps) {
  const metrics = [
    {
      label: "Alcance",
      value: formatNumber(overview.reach),
      icon: Eye,
      highlight: false,
    },
    {
      label: "Impressões",
      value: formatNumber(overview.impressions),
      icon: BarChart3,
      highlight: false,
    },
    {
      label: "Investimento Total",
      value: formatCurrency(overview.totalSpend),
      icon: DollarSign,
      highlight: true,
    },
    {
      label: "ROAS",
      value: `${overview.roas.toFixed(1)}x`,
      icon: TrendingUp,
      highlight: true,
    },
    {
      label: "Taxa de Engajamento",
      value: `${overview.engagementRate.toFixed(2)}%`,
      icon: Heart,
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.label}
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
                    ? "text-white"
                    : "bg-[var(--atria-accent)]/30 text-[var(--atria-primary)]"
                }`}
                style={
                  metric.highlight ? { backgroundColor: PRIMARY } : undefined
                }
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p
              className="text-xl font-bold"
              style={{ color: PRIMARY }}
            >
              {metric.value}
            </p>
            <p className="text-xs" style={{ color: `${PRIMARY}80` }}>
              {metric.label}
            </p>
          </Card>
        );
      })}
    </div>
  );
}

export { PRIMARY as INSIGHTS_PRIMARY, ACCENT as INSIGHTS_ACCENT };
