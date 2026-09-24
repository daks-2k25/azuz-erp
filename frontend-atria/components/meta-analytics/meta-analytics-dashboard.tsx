"use client";

import {
  AlertCircle,
  BarChart3,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetaAnalyticsMetricCards } from "@/components/meta-analytics/meta-analytics-metric-cards";
import { MetaCampaignsTable } from "@/components/meta-analytics/meta-campaigns-table";
import { MetaClientSelector } from "@/components/meta-analytics/meta-client-selector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetaAnalytics, useMetaAgencyOverview } from "@/hooks/use-meta-analytics";
import { useMetaClientSelection } from "@/hooks/use-meta-client-selection";
import type { MetaDatePreset } from "@/services/types";

const DATE_PRESET_OPTIONS: { value: MetaDatePreset; label: string }[] = [
  { value: "last_7d", label: "Últimos 7 dias" },
  { value: "last_30d", label: "Últimos 30 dias" },
  { value: "last_90d", label: "Últimos 90 dias" },
  { value: "this_month", label: "Este mês" },
  { value: "last_month", label: "Mês passado" },
  { value: "this_year", label: "Este ano" },
  { value: "maximum", label: "Todo o período" },
];

const MONTH_OPTIONS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function MetaAnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5"
        >
          <Skeleton className="mb-3 size-8 rounded-xl" />
          <Skeleton className="mb-2 h-7 w-28" />
          <Skeleton className="h-3 w-24" />
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ title = "Não há dados no momento" }: { title?: string }) {
  return (
    <Card className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--atria-primary)]/20 bg-white px-6 py-12 text-center">
      <div className="rounded-full bg-[var(--atria-accent)]/20 p-3 text-[var(--atria-primary)]">
        <BarChart3 className="size-6" />
      </div>
      <p className="font-semibold text-[var(--atria-primary)]">{title}</p>
      <p className="text-sm text-[var(--atria-primary)]/50">
        Ajuste o cliente, o período ou o mês para visualizar métricas.
      </p>
    </Card>
  );
}

export function MetaAnalyticsDashboard() {
  const {
    clients,
    selectedClientId,
    setSelectedClientId,
    datePreset,
    setDatePreset,
    month,
    year,
    setMonthFilter,
    nameSearch,
    setSearch,
    isLoadingClients,
    isClientsError,
    clientsError,
    refetchClients,
  } = useMetaClientSelection();

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  const agencyQuery = {
    datePreset: month && year ? undefined : datePreset,
    month,
    year,
    search: nameSearch || undefined,
  };

  const {
    data: agencyData,
    isLoading: agencyLoading,
    isFetching: agencyFetching,
    isError: agencyError,
    error: agencyErr,
    refetch: refetchAgency,
  } = useMetaAgencyOverview(agencyQuery);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMetaAnalytics(
    selectedClientId,
    datePreset,
    month,
    year,
  );

  const overview = data?.overview;
  const performance = data?.performance ?? [];
  const campaigns = data?.campaigns ?? [];
  const showClientSkeleton =
    isLoadingClients || !selectedClientId || isLoading || (isFetching && !data);
  const clientEmpty = Boolean(
    data?.empty ||
      (overview &&
        overview.totalSpend === 0 &&
        overview.impressions === 0 &&
        campaigns.length === 0),
  );

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
            Analytics Meta Ads
          </h2>
          <p className="text-sm text-[var(--atria-primary)]/50">
            Visão da agência e dos clientes com filtros por nome e período
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-4 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="relative min-w-[16rem] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--atria-primary)]/40" />
            <Input
              value={nameSearch}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar cliente por nome..."
              className="pl-9"
            />
          </div>

          <MetaClientSelector
            clients={clients}
            value={selectedClientId}
            onValueChange={setSelectedClientId}
            loading={isLoadingClients}
            disabled={isClientsError}
          />

          <select
            value={month && year ? "custom_month" : datePreset}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "custom_month") {
                setMonthFilter(new Date().getMonth() + 1, currentYear);
                return;
              }
              setDatePreset(value as MetaDatePreset);
            }}
            className="h-9 rounded-lg border border-input bg-white px-3 text-sm"
          >
            {DATE_PRESET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value="custom_month">Mês específico</option>
          </select>

          {(month && year) || datePreset === "custom" ? (
            <>
              <select
                value={month ?? new Date().getMonth() + 1}
                onChange={(e) =>
                  setMonthFilter(Number(e.target.value), year ?? currentYear)
                }
                className="h-9 rounded-lg border border-input bg-white px-3 text-sm"
              >
                {MONTH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={year ?? currentYear}
                onChange={(e) =>
                  setMonthFilter(month ?? new Date().getMonth() + 1, Number(e.target.value))
                }
                className="h-9 rounded-lg border border-input bg-white px-3 text-sm"
              >
                {yearOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              void refetchClients();
              void refetchAgency();
              void refetch();
            }}
            disabled={isFetching || agencyFetching || isLoadingClients}
          >
            <RefreshCw
              className={`size-4 ${isFetching || agencyFetching ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {isClientsError && (
        <Card className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50/60 px-6 py-8 text-center">
          <AlertCircle className="size-6 text-red-600" />
          <p className="font-semibold text-red-800">
            Não foi possível carregar as contas Meta
          </p>
          <p className="text-sm text-red-700/80">
            {clientsError instanceof Error
              ? clientsError.message
              : "Erro inesperado ao consultar contas."}
          </p>
          <Button type="button" variant="outline" onClick={() => void refetchClients()}>
            Tentar novamente
          </Button>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--atria-primary)]/50">
          Resumo da agência
        </h3>
        {(agencyLoading || (agencyFetching && !agencyData)) && <MetaAnalyticsSkeleton />}
        {!agencyLoading && agencyError && (
          <Card className="rounded-2xl border border-red-200 bg-red-50/60 p-6 text-center text-sm text-red-800">
            {agencyErr instanceof Error
              ? agencyErr.message
              : "Erro ao carregar resumo da agência."}
          </Card>
        )}
        {!agencyLoading && !agencyError && agencyData?.empty && (
          <EmptyState />
        )}
        {!agencyLoading && !agencyError && agencyData && !agencyData.empty && (
          <>
            <MetaAnalyticsMetricCards data={agencyData.totals} />
            <Card className="overflow-hidden rounded-2xl border border-[var(--atria-primary)]/10 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[var(--atria-primary)]/5 text-left text-[var(--atria-primary)]/60">
                    <tr>
                      <th className="px-4 py-3 font-medium">Cliente</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Investimento</th>
                      <th className="px-4 py-3 font-medium">Impressões</th>
                      <th className="px-4 py-3 font-medium">Cliques</th>
                      <th className="px-4 py-3 font-medium">CTR</th>
                      <th className="px-4 py-3 font-medium">Conversas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agencyData.accounts.map((row) => (
                      <tr
                        key={row.client.id}
                        className="cursor-pointer border-t border-[var(--atria-primary)]/8 hover:bg-[var(--atria-accent)]/10"
                        onClick={() => setSelectedClientId(row.client.id)}
                      >
                        <td className="px-4 py-3 font-medium text-[var(--atria-primary)]">
                          {row.client.name}
                        </td>
                        <td className="px-4 py-3 text-[var(--atria-primary)]/60">
                          {row.client.isActive ? "Ativa" : "Inativa"}
                        </td>
                        <td className="px-4 py-3 text-[var(--atria-primary)]">
                          {row.empty
                            ? "—"
                            : formatCurrency(row.overview.totalSpend)}
                        </td>
                        <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                          {row.empty
                            ? "—"
                            : row.overview.impressions.toLocaleString("pt-BR")}
                        </td>
                        <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                          {row.empty
                            ? "—"
                            : row.overview.clicks.toLocaleString("pt-BR")}
                        </td>
                        <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                          {row.empty
                            ? "—"
                            : `${row.overview.ctr.toFixed(2)}%`}
                        </td>
                        <td className="px-4 py-3 text-[var(--atria-primary)]/70">
                          {row.empty
                            ? "—"
                            : row.overview.messagingConversations.toLocaleString(
                                "pt-BR",
                              )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--atria-primary)]/50">
          Detalhe do cliente selecionado
        </h3>

        {showClientSkeleton && !isClientsError && <MetaAnalyticsSkeleton />}

        {!showClientSkeleton && isError && (
          <Card className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50/60 px-6 py-10 text-center">
            <AlertCircle className="size-6 text-red-600" />
            <p className="font-semibold text-red-800">
              Não foi possível carregar os analytics
            </p>
            <p className="text-sm text-red-700/80">
              {error instanceof Error
                ? error.message
                : "Erro inesperado ao consultar a API."}
            </p>
            <Button type="button" variant="outline" onClick={() => void refetch()}>
              Tentar novamente
            </Button>
          </Card>
        )}

        {!showClientSkeleton && !isError && clientEmpty && <EmptyState />}

        {!showClientSkeleton && !isError && overview && !clientEmpty && (
          <>
            <MetaAnalyticsMetricCards data={overview} />
            <MetaCampaignsTable campaigns={campaigns} />
            {performance.length > 0 ? (
              <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
                <h4 className="mb-4 text-sm font-semibold text-[var(--atria-primary)]">
                  Investimento diário
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performance}>
                      <defs>
                        <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#004949" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#004949" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#00494922" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value: string) =>
                          new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                          })
                        }
                        stroke="#00494966"
                        fontSize={11}
                      />
                      <YAxis
                        stroke="#00494966"
                        fontSize={11}
                        tickFormatter={(value: number) =>
                          value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)
                        }
                      />
                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(Number(value ?? 0))
                        }
                        labelFormatter={(label) =>
                          new Date(`${label}T12:00:00`).toLocaleDateString("pt-BR")
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="spend"
                        stroke="#004949"
                        fill="url(#spendFill)"
                        name="Investimento"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
