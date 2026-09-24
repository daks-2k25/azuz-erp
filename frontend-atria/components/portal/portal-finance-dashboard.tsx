"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Loader2, Receipt } from "lucide-react";
import { PortalFinanceDocuments } from "@/components/portal/portal-finance-documents";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/financial-utils";
import type {
  ClientPortalFinances,
  PortalFinanceDocument,
} from "@/services/types";

const TEAL = "#004A4A";
const GOLD = "#D4BA97";

interface PortalFinanceDashboardProps {
  loadFinances: () => Promise<ClientPortalFinances>;
  loadFinanceDocuments?: () => Promise<PortalFinanceDocument[]>;
  uploadFinanceDocument?: (file: File) => Promise<PortalFinanceDocument>;
  resolveAssetUrl?: (url: string) => string;
  paymentUrl?: string | null;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

export function PortalFinanceDashboard({
  loadFinances,
  loadFinanceDocuments,
  uploadFinanceDocument,
  resolveAssetUrl,
  paymentUrl,
}: PortalFinanceDashboardProps) {
  const [data, setData] = useState<ClientPortalFinances | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadFinances();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar o financeiro.",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [loadFinances]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-[var(--atria-primary)]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-medium text-red-800">{error ?? "Sem dados"}</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => void load()}>
          Tentar novamente
        </Button>
      </Card>
    );
  }

  const activeInvoices = [...data.overdue, ...data.pending];
  const history = data.paid;

  return (
    <div className="flex flex-col gap-6">
      <Card
        className="rounded-2xl border-0 p-6 text-white shadow-lg"
        style={{ backgroundColor: TEAL }}
      >
        <p
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: GOLD }}
        >
          Resumo financeiro
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Total Devido à Agência</h2>
        <p className="mt-4 text-4xl font-bold" style={{ color: GOLD }}>
          {formatCurrency(data.totals.totalDue)}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
          <span>{data.totals.pendingCount} pendente(s)</span>
          <span>{data.totals.overdueCount} em atraso</span>
          <span>
            Pago: {formatCurrency(data.totals.totalPaid)}
          </span>
        </div>
      </Card>

      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Receipt className="size-5 text-[var(--atria-primary)]" />
          <h3 className="font-semibold text-[var(--atria-primary)]">
            Faturas pendentes
          </h3>
        </div>

        {activeInvoices.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--atria-primary)]/45">
            Nenhuma fatura pendente no momento.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-[var(--atria-primary)]/50">
                <tr>
                  <th className="px-2 py-2 font-medium">Descrição</th>
                  <th className="px-2 py-2 font-medium">Vencimento</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-2 py-2 font-medium">Valor</th>
                  <th className="px-2 py-2 text-right font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {activeInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-t border-[var(--atria-primary)]/8"
                  >
                    <td className="px-2 py-3 font-medium text-[var(--atria-primary)]">
                      {invoice.title ?? invoice.description}
                    </td>
                    <td className="px-2 py-3 text-[var(--atria-primary)]/70">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          invoice.status === "overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {invoice.status === "overdue" ? "Atrasada" : "Pendente"}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-[var(--atria-primary)]">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-2 py-3 text-right">
                      {paymentUrl ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          render={
                            <a
                              href={paymentUrl}
                              target="_blank"
                              rel="noreferrer"
                            />
                          }
                        >
                          <ExternalLink className="size-3.5" />
                          Pagar
                        </Button>
                      ) : (
                        <span className="text-xs text-[var(--atria-primary)]/40">
                          Contate a agência
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {loadFinanceDocuments && uploadFinanceDocument && resolveAssetUrl && (
        <PortalFinanceDocuments
          loadDocuments={loadFinanceDocuments}
          uploadDocument={uploadFinanceDocument}
          resolveAssetUrl={resolveAssetUrl}
        />
      )}

      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
        <h3 className="mb-4 font-semibold text-[var(--atria-primary)]">
          Histórico de pagamentos
        </h3>
        {history.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--atria-primary)]/45">
            Nenhum pagamento registrado ainda.
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--atria-primary)]/8 px-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--atria-primary)]">
                    {invoice.title ?? invoice.description}
                  </p>
                  <p className="text-xs text-[var(--atria-primary)]/45">
                    {formatDate(invoice.date)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-emerald-700">
                  {formatCurrency(invoice.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
