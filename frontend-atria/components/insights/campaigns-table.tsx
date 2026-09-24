"use client";

import { useState } from "react";
import { Pause, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { insightsService } from "@/services";
import type { MetaCampaign, MetaCampaignStatus } from "@/services/types";

const PRIMARY = "#004949";

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
  learning: "Aprendizado",
  unknown: "—",
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface CampaignsTableProps {
  campaigns: MetaCampaign[];
  onUpdate: () => void;
}

export function CampaignsTable({ campaigns, onUpdate }: CampaignsTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleCampaign(campaign: MetaCampaign) {
    if (campaign.status !== "active" && campaign.status !== "paused") return;

    setLoadingId(campaign.id);
    try {
      const newStatus = campaign.status === "active" ? "paused" : "active";
      await insightsService.updateCampaignStatus(campaign.id, newStatus);
      onUpdate();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
      <h2
        className="mb-4 font-semibold"
        style={{ color: PRIMARY }}
      >
        Campanhas Meta Ads
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ color: `${PRIMARY}80` }}>Campanha</TableHead>
            <TableHead style={{ color: `${PRIMARY}80` }}>Status</TableHead>
            <TableHead style={{ color: `${PRIMARY}80` }}>Orçamento</TableHead>
            <TableHead style={{ color: `${PRIMARY}80` }}>Gasto</TableHead>
            <TableHead style={{ color: `${PRIMARY}80` }}>CPC</TableHead>
            <TableHead style={{ color: `${PRIMARY}80` }}>CTR</TableHead>
            <TableHead style={{ color: `${PRIMARY}80` }}>ROAS</TableHead>
            <TableHead className="text-right" style={{ color: `${PRIMARY}80` }}>
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>
                <div>
                  <p className="font-medium" style={{ color: PRIMARY }}>
                    {campaign.name}
                  </p>
                  <p className="text-xs" style={{ color: `${PRIMARY}50` }}>
                    {campaign.startDate}
                    {campaign.endDate ? ` → ${campaign.endDate}` : " → contínuo"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[campaign.status]}`}
                >
                  {STATUS_LABELS[campaign.status]}
                </span>
              </TableCell>
              <TableCell style={{ color: `${PRIMARY}90` }}>
                {formatCurrency(campaign.budget)}
                <span className="text-xs" style={{ color: `${PRIMARY}50` }}>
                  /{campaign.budgetType === "daily" ? "dia" : "total"}
                </span>
              </TableCell>
              <TableCell style={{ color: `${PRIMARY}90` }}>
                {formatCurrency(campaign.spend)}
              </TableCell>
              <TableCell style={{ color: `${PRIMARY}90` }}>
                {formatCurrency(campaign.cpc)}
              </TableCell>
              <TableCell style={{ color: `${PRIMARY}90` }}>
                {campaign.ctr.toFixed(2)}%
              </TableCell>
              <TableCell>
                <span
                  className="font-medium"
                  style={{
                    color: campaign.roas >= 3 ? "#16a34a" : PRIMARY,
                  }}
                >
                  {campaign.roas.toFixed(1)}x
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {(campaign.status === "active" ||
                    campaign.status === "paused") && (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={loadingId === campaign.id}
                      onClick={() => void toggleCampaign(campaign)}
                      title={
                        campaign.status === "active" ? "Pausar" : "Ativar"
                      }
                    >
                      {campaign.status === "active" ? (
                        <Pause className="size-4" style={{ color: PRIMARY }} />
                      ) : (
                        <Play className="size-4" style={{ color: PRIMARY }} />
                      )}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon-sm" title="Ver no Meta">
                    <ExternalLink
                      className="size-4"
                      style={{ color: `${PRIMARY}60` }}
                    />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
