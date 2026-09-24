"use client";

import { ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatPeriodLabel,
  type CreationPeriod,
} from "@/lib/creation-date-utils";
import { cn } from "@/lib/utils";
import type { Client } from "@/services/types";

const PERIOD_OPTIONS: { id: CreationPeriod; label: string }[] = [
  { id: "day", label: "Dia" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mês" },
];

interface CreationViewToolbarProps {
  clients: Client[];
  clientId: string;
  period: CreationPeriod;
  anchor: Date;
  onClientChange: (clientId: string) => void;
  onPeriodChange: (period: CreationPeriod) => void;
  onAnchorChange: (anchor: Date) => void;
  onCreateClick: () => void;
}

export function CreationViewToolbar({
  clients,
  clientId,
  period,
  anchor,
  onClientChange,
  onPeriodChange,
  onAnchorChange,
  onCreateClick,
}: CreationViewToolbarProps) {
  function step(direction: -1 | 1) {
    const next = new Date(anchor);
    if (period === "day") next.setDate(next.getDate() + direction);
    else if (period === "week") next.setDate(next.getDate() + direction * 7);
    else next.setMonth(next.getMonth() + direction);
    onAnchorChange(next);
  }

  function goToday() {
    onAnchorChange(new Date());
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <label
            htmlFor="creation-client"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--atria-primary)]"
          >
            <Users className="size-4 text-[var(--atria-primary)]/50" />
            Selecionar Cliente
          </label>
          <select
            id="creation-client"
            value={clientId}
            onChange={(e) => onClientChange(e.target.value)}
            className="h-11 w-full max-w-lg rounded-xl border border-[var(--atria-primary)]/15 bg-transparent px-3 text-sm text-[var(--atria-primary)]"
          >
            <option value="">Selecionar cliente...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={onCreateClick}
          disabled={!clientId}
          className="gap-2 bg-[var(--atria-primary)] text-white"
        >
          <Plus className="size-4" />
          Criar Item / Compromisso
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onPeriodChange(option.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                period === option.id
                  ? "bg-[var(--atria-primary)] text-white"
                  : "bg-[var(--atria-primary)]/5 text-[var(--atria-primary)] hover:bg-[var(--atria-primary)]/10",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => step(-1)}
            aria-label="Período anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <button
            type="button"
            onClick={goToday}
            className="min-w-[200px] rounded-lg bg-[var(--atria-accent)]/15 px-4 py-2 text-sm font-medium text-[var(--atria-primary)] hover:bg-[var(--atria-accent)]/25"
          >
            {formatPeriodLabel(period, anchor)}
          </button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => step(1)}
            aria-label="Próximo período"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
