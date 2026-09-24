"use client";

import { useEffect, useState } from "react";
import { BarChart3, Eye, Heart, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { contentService } from "@/services";
import type { PostInsights } from "@/services/types";

interface PostInsightsCardProps {
  postId: string;
  compact?: boolean;
}

export function PostInsightsCard({ postId, compact }: PostInsightsCardProps) {
  const [insights, setInsights] = useState<PostInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    contentService
      .getPostInsights(postId)
      .then(setInsights)
      .catch(() => setInsights(null))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) {
    return (
      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-4">
        <div className="h-16 animate-pulse rounded-lg bg-[var(--atria-primary)]/5" />
      </Card>
    );
  }

  if (!insights) return null;

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
    <Card
      className={`rounded-2xl border border-[var(--atria-primary)]/10 bg-white ${compact ? "p-4" : "p-5"}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--atria-primary)]">
          Meta / Instagram
        </h3>
        {insights.isEstimated && (
          <span className="text-[10px] text-[var(--atria-primary)]/40">
            Estimado
          </span>
        )}
      </div>
      <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-[var(--atria-primary)]/[0.03] p-3"
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
