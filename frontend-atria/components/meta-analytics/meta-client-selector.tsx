"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MetaAdAccountClient } from "@/services/types";

function getStatusLabel(client: MetaAdAccountClient) {
  return client.isActive ? "Ativa" : "Inativa";
}

function formatAmountSpent(amount: number, currency: string) {
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: currency || "BRL",
  });
}

interface MetaClientSelectorProps {
  clients: MetaAdAccountClient[];
  value: string;
  onValueChange: (clientId: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function MetaClientSelector({
  clients,
  value,
  onValueChange,
  disabled = false,
  loading = false,
}: MetaClientSelectorProps) {
  if (loading) {
    return <Skeleton className="h-9 w-full min-w-[14rem] rounded-lg" />;
  }

  if (clients.length === 0) {
    return (
      <div className="flex h-9 min-w-[14rem] items-center rounded-lg border border-dashed border-input px-3 text-sm text-muted-foreground">
        Nenhuma conta Meta disponível
      </div>
    );
  }

  const selectedClient = clients.find((client) => client.id === value);

  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) onValueChange(nextValue);
      }}
      disabled={disabled || clients.length === 0}
    >
      <SelectTrigger aria-label="Selecionar conta Meta">
        {selectedClient ? (
          <div className="flex min-w-0 flex-col items-start text-left">
            <span className="truncate font-medium text-[var(--atria-primary)]">
              {selectedClient.name}
            </span>
            <span className="text-[10px] text-[var(--atria-primary)]/50">
              {formatAmountSpent(selectedClient.amountSpent, selectedClient.currency)} ·{" "}
              {getStatusLabel(selectedClient)}
            </span>
          </div>
        ) : (
          <SelectValue placeholder="Selecione uma conta" />
        )}
      </SelectTrigger>
      <SelectContent>
        {clients.map((client) => (
          <SelectItem key={client.id} value={client.id}>
            <div className="flex flex-col gap-0.5 py-0.5">
              <span className="font-medium text-[var(--atria-primary)]">
                {client.name}
              </span>
              <span className="text-[11px] text-[var(--atria-primary)]/50">
                {formatAmountSpent(client.amountSpent, client.currency)} ·{" "}
                {getStatusLabel(client)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
