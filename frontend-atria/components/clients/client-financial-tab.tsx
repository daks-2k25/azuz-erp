"use client";

import { useState } from "react";
import Link from "next/link";
import { FileSignature } from "lucide-react";
import { LiquidGlassCard } from "@/components/creation/liquid-glass-card";
import { PdfViewerDialog } from "@/components/pdf/pdf-viewer-dialog";
import { Button } from "@/components/ui/button";
import type { Client360Financial } from "@/services/types";

const STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  sent: "Enviado",
  signed: "Assinado",
  expired: "Expirado",
  cancelled: "Cancelado",
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  sent: "bg-amber-100 text-amber-800",
  signed: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-500",
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface ClientFinancialTabProps {
  data: Client360Financial;
}

export function ClientFinancialTab({ data }: ClientFinancialTabProps) {
  const { monthlyInvoicing } = data;
  const [pdfPreview, setPdfPreview] = useState<{
    url: string;
    title: string;
  } | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <LiquidGlassCard className="!p-4" accent>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--atria-primary)]/50">
            MRR
          </p>
          <p className="text-2xl font-bold text-[var(--atria-primary)]">
            {formatCurrency(data.mrr)}
          </p>
        </LiquidGlassCard>
        <LiquidGlassCard className="!p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--atria-primary)]/50">
            Faturado no mês
          </p>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(monthlyInvoicing.paid)}
          </p>
        </LiquidGlassCard>
        <LiquidGlassCard className="!p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--atria-primary)]/50">
            Pendente no mês
          </p>
          <p className="text-2xl font-bold text-amber-700">
            {formatCurrency(monthlyInvoicing.pending)}
          </p>
        </LiquidGlassCard>
      </div>

      <LiquidGlassCard>
        <h2 className="mb-4 text-lg font-semibold text-[var(--atria-primary)]">
          Contratos
        </h2>
        <div className="flex flex-col gap-2">
          {data.contracts.length === 0 ? (
            <p className="text-sm text-[var(--atria-primary)]/50">
              Nenhum contrato cadastrado.
            </p>
          ) : (
            data.contracts.map((contract) => (
              <div
                key={contract.id}
                className="flex flex-col gap-3 rounded-xl border border-white/40 bg-white/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--atria-primary)]/10">
                    <FileSignature className="size-5 text-[var(--atria-primary)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--atria-primary)]">
                      {contract.title}
                    </p>
                    <p className="text-xs text-[var(--atria-primary)]/60">
                      {formatCurrency(contract.recurringValue)} ·{" "}
                      {contract.paymentFrequency === "monthly"
                        ? "Mensal"
                        : "Único"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[contract.status]}`}
                  >
                    {STATUS_LABELS[contract.status]}
                  </span>
                  {contract.pdfUrl && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-auto gap-1 px-2 py-1 text-xs font-medium text-[var(--atria-primary)]"
                      onClick={() =>
                        setPdfPreview({
                          url: contract.pdfUrl!,
                          title: contract.title,
                        })
                      }
                    >
                      Visualizar PDF
                    </Button>
                  )}
                  <Link
                    href="/contracts"
                    className="text-xs font-medium text-[var(--atria-primary)]/60 hover:underline"
                  >
                    Gerenciar
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </LiquidGlassCard>

      <LiquidGlassCard>
        <h2 className="mb-4 text-lg font-semibold text-[var(--atria-primary)]">
          Faturamento do mês ({monthlyInvoicing.month}/{monthlyInvoicing.year})
        </h2>
        <div className="flex flex-col gap-2">
          {monthlyInvoicing.items.length === 0 ? (
            <p className="text-sm text-[var(--atria-primary)]/50">
              Nenhuma fatura registrada neste mês.
            </p>
          ) : (
            monthlyInvoicing.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-white/40 bg-white/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--atria-primary)]">
                    {item.description}
                  </p>
                  <p className="text-[10px] text-[var(--atria-primary)]/40">
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                    {item.dueDate
                      ? ` · Venc. ${new Date(item.dueDate).toLocaleDateString("pt-BR")}`
                      : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--atria-primary)]">
                    {formatCurrency(item.amount)}
                  </p>
                  <p
                    className={`text-[10px] font-medium ${item.status === "paid" ? "text-green-600" : "text-amber-600"}`}
                  >
                    {item.status === "paid" ? "Pago" : "Pendente"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </LiquidGlassCard>

      <PdfViewerDialog
        url={pdfPreview?.url ?? null}
        title={pdfPreview?.title}
        fileName={pdfPreview?.title}
        open={Boolean(pdfPreview)}
        onOpenChange={(open) => {
          if (!open) setPdfPreview(null);
        }}
      />
    </div>
  );
}
