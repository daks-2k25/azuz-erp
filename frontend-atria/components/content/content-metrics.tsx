import { Clock, FileEdit, Send, Layers, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ContentOverview } from "@/services/types";

interface ContentMetricsProps {
  overview: ContentOverview;
}

const metrics = [
  {
    key: "drafts" as const,
    label: "Rascunhos",
    icon: FileEdit,
    highlight: false,
  },
  {
    key: "pendingApproval" as const,
    label: "Em Aprovação",
    icon: CheckCircle2,
    highlight: true,
  },
  {
    key: "scheduled" as const,
    label: "Agendados",
    icon: Clock,
    highlight: true,
  },
  {
    key: "published" as const,
    label: "Publicados",
    icon: Send,
    highlight: false,
  },
  {
    key: "total" as const,
    label: "Total de Posts",
    icon: Layers,
    highlight: false,
  },
];

export function ContentMetrics({ overview }: ContentMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const value = overview[metric.key];

        return (
          <Card
            key={metric.key}
            className={`rounded-2xl border p-5 ${
              metric.highlight
                ? "border-[var(--atria-accent)]/40 bg-[var(--atria-accent)]/10"
                : "border-[var(--atria-primary)]/10 bg-white"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className={`rounded-xl p-2 ${
                  metric.highlight
                    ? "bg-[var(--atria-primary)] text-white"
                    : "bg-[var(--atria-accent)]/30 text-[var(--atria-primary)]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-[var(--atria-primary)]">
              {value}
            </p>
            <p className="text-xs text-[var(--atria-primary)]/50">
              {metric.label}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
