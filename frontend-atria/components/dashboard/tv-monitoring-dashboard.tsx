"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  Calendar,
  CircleDollarSign,
  ClipboardList,
  Radio,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTvMonitoring } from "@/hooks/use-tv-monitoring";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import { ClientName } from "@/components/ui/client-name";
import { formatCurrency } from "@/lib/financial-utils";
import {
  CALENDAR_WEEKDAY_LONG,
  formatEventScheduleDetail,
  getEventDisplayColor,
  getViewDateRange,
  getWeekDays,
  isSameDay,
} from "@/lib/calendar-utils";
import { STATUS_COLORS } from "@/lib/kanban-utils";
import { cn } from "@/lib/utils";
import type {
  CalendarEvent,
  TvDeliveryTask,
  TvMonitoringOverview,
  TvTaskDeliveryBucket,
} from "@/services/types";

const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

const DELIVERY_SEGMENTS: Array<{
  key: TvTaskDeliveryBucket;
  label: string;
  color: string;
}> = [
  {
    key: "taskCreated",
    label: "Em produção",
    color: STATUS_COLORS.falta_gravar,
  },
  {
    key: "awaitingJhonatan",
    label: "Esperando aprovação Jhonatan",
    color: STATUS_COLORS.producao,
  },
  {
    key: "awaitingClient",
    label: "Esperando aprovação do cliente",
    color: STATUS_COLORS.jhonatan_aprovou,
  },
];

export function TvMonitoringDashboard() {
  const { data, isLoading, isFetching, isError, dataUpdatedAt } =
    useTvMonitoring();

  if (isLoading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--atria-base)] text-[var(--atria-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-14 animate-spin rounded-full border-4 border-[var(--atria-primary)]/10 border-t-[var(--atria-primary)]" />
          <p className="text-lg font-medium text-[var(--atria-primary)]/60">
            Carregando painel de acompanhamento...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--atria-base)] p-8 text-[var(--atria-primary)]">
        <div className="max-w-lg rounded-3xl border border-red-500/20 bg-white px-8 py-10 text-center shadow-sm shadow-[var(--atria-primary)]/5">
          <AlertTriangle className="mx-auto mb-4 size-12 text-red-500" />
          <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
            Falha ao carregar o painel
          </h1>
          <p className="mt-2 text-[var(--atria-primary)]/60">
            Verifique a conexão com o servidor. A atualização automática tentará
            novamente em instantes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--atria-base)] p-8 text-[var(--atria-primary)]">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-8">
        <TvHeader
          generatedAt={data.generatedAt}
          dataUpdatedAt={dataUpdatedAt}
          isFetching={isFetching}
          periodLabel={formatPeriodLabel(data.finance.period)}
        />

        <TaskDeliverySection delivery={data.tasks.delivery} />

        <FinanceSection finance={data.finance} periodLabel={formatPeriodLabel(data.finance.period)} />

        <div className="grid min-h-0 flex-1 gap-8 xl:grid-cols-5">
          <LeadsPipelineSection
            stages={data.leads.stages}
            totalActive={data.leads.totalActive}
          />
          <TvCalendarSection />
        </div>
      </div>
    </div>
  );
}

function TvHeader({
  generatedAt,
  dataUpdatedAt,
  isFetching,
  periodLabel,
}: {
  generatedAt: string;
  dataUpdatedAt: number;
  isFetching: boolean;
  periodLabel: string;
}) {
  const displayTime = new Date(dataUpdatedAt || generatedAt).toLocaleTimeString(
    "pt-BR",
    { hour: "2-digit", minute: "2-digit", second: "2-digit" },
  );

  return (
    <header className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--atria-primary)]/10 pb-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--atria-accent)]">
          Atria ERP
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-[var(--atria-primary)] xl:text-5xl">
          Acompanhamento TV
        </h1>
        <p className="mt-2 text-lg text-[var(--atria-primary)]/50">
          Visão operacional em tempo real · {periodLabel}
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-[var(--atria-primary)]/10 bg-white px-5 py-3 shadow-sm shadow-[var(--atria-primary)]/5">
        <span
          className={cn(
            "relative flex size-3 rounded-full",
            isFetching ? "bg-[var(--atria-accent)]" : "bg-[var(--atria-primary)]",
          )}
        >
          {isFetching ? (
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--atria-accent)] opacity-75" />
          ) : null}
        </span>
        <div className="text-right">
          <p className="flex items-center gap-2 text-sm font-medium text-[var(--atria-primary)]/70">
            <Radio className="size-4 text-[var(--atria-primary)]" />
            {isFetching ? "Atualizando..." : "Ao vivo"}
          </p>
          <p className="text-xs text-[var(--atria-primary)]/40">
            Última sincronização às {displayTime}
          </p>
        </div>
      </div>
    </header>
  );
}

function TaskDeliverySection({
  delivery,
}: {
  delivery: TvMonitoringOverview["tasks"]["delivery"];
}) {
  const total = delivery.total || 1;
  const deliveryTasks = delivery.tasks ?? {
    taskCreated: [],
    awaitingJhonatan: [],
    awaitingClient: [],
  };

  return (
    <section className="rounded-3xl border border-[var(--atria-primary)]/10 bg-white p-6 shadow-sm shadow-[var(--atria-primary)]/5">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--atria-accent)]/25 text-[var(--atria-primary)]">
            <ClipboardList className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--atria-primary)]">
              Entrega de tarefas
            </h2>
            <p className="text-[var(--atria-primary)]/50">
              {delivery.total} tarefas no fluxo de produção
            </p>
          </div>
        </div>
      </div>

      {delivery.total > 0 ? (
        <div className="mb-6 flex h-4 overflow-hidden rounded-full bg-[var(--atria-primary)]/10">
          {DELIVERY_SEGMENTS.map((segment) => {
            const count = delivery[segment.key];
            const width = (count / total) * 100;
            if (width <= 0) return null;
            return (
              <div
                key={segment.key}
                className="h-full transition-all duration-700"
                style={{ width: `${width}%`, backgroundColor: segment.color }}
                title={`${segment.label}: ${count}`}
              />
            );
          })}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DELIVERY_SEGMENTS.map((segment) => {
          const count = delivery[segment.key];
          const tasks = deliveryTasks[segment.key] ?? [];

          return (
            <div
              key={segment.key}
              className="flex min-h-[320px] flex-col rounded-2xl border border-[var(--atria-primary)]/10 bg-[var(--atria-primary)]/[0.02]"
              style={{ boxShadow: `0 8px 24px -12px ${segment.color}55` }}
            >
              <div
                className="border-b border-[var(--atria-primary)]/10 px-4 py-4"
                style={{ borderTop: `3px solid ${segment.color}` }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: segment.color }}
                >
                  {segment.label}
                </p>
                <p className="mt-1 text-sm text-[var(--atria-primary)]/50">
                  {count} {count === 1 ? "tarefa" : "tarefas"}
                </p>
              </div>

              {tasks.length === 0 ? (
                <div className="flex flex-1 items-center justify-center px-4 py-8">
                  <p className="text-center text-sm text-[var(--atria-primary)]/40">
                    Nenhuma tarefa nesta etapa
                  </p>
                </div>
              ) : (
                <div className="flex max-h-[420px] flex-1 flex-col gap-2 overflow-y-auto p-3">
                  {tasks.map((task) => (
                    <DeliveryTaskCard key={task.id} task={task} accent={segment.color} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DeliveryTaskCard({
  task,
  accent,
}: {
  task: TvDeliveryTask;
  accent: string;
}) {
  return (
    <article
      className="rounded-xl border border-[var(--atria-primary)]/10 bg-white p-3"
      style={{ borderLeftColor: accent, borderLeftWidth: "3px" }}
    >
      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--atria-primary)]">
        {task.title}
      </h3>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--atria-primary)]/50">
        {task.clientName ? <ClientName>{task.clientName}</ClientName> : null}
        {task.dueDate ? (
          <span>
            Prazo: {new Date(task.dueDate).toLocaleDateString("pt-BR")}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function FinanceSection({
  finance,
  periodLabel,
}: {
  finance: TvMonitoringOverview["finance"];
  periodLabel: string;
}) {
  const cards = [
    {
      label: "Receita realizada",
      value: formatCurrency(finance.totalRevenue),
      sub: periodLabel,
      icon: TrendingUp,
      tone: "text-[var(--atria-primary)] bg-[var(--atria-accent)]/25",
    },
    {
      label: "Despesas pagas",
      value: formatCurrency(finance.totalExpenses),
      sub: periodLabel,
      icon: TrendingDown,
      tone: "text-red-700 bg-red-500/10",
    },
    {
      label: "Resultado líquido",
      value: formatCurrency(finance.netProfit),
      sub: `${finance.profitMargin}% margem`,
      icon: CircleDollarSign,
      tone: "text-[var(--atria-primary)] bg-[var(--atria-accent)]/25",
    },
  ];

  return (
    <section className="rounded-3xl border border-[var(--atria-primary)]/10 bg-white p-6 shadow-sm shadow-[var(--atria-primary)]/5">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--atria-accent)]/25 text-[var(--atria-primary)]">
          <CircleDollarSign className="size-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[var(--atria-primary)]">
            Financeiro
          </h2>
          <p className="text-[var(--atria-primary)]/50">
            Indicadores do mês corrente
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[var(--atria-primary)]/10 bg-[var(--atria-primary)]/[0.02] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-[var(--atria-primary)]/50">
                {card.label}
              </p>
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  card.tone,
                )}
              >
                <card.icon className="size-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black tabular-nums tracking-tight text-[var(--atria-primary)] xl:text-4xl">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-[var(--atria-primary)]/40">{card.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LeadsPipelineSection({
  stages,
  totalActive,
}: {
  stages: TvMonitoringOverview["leads"]["stages"];
  totalActive: number;
}) {
  const maxCount = Math.max(...stages.map((stage) => stage.count), 1);

  return (
    <section className="xl:col-span-2 rounded-3xl border border-[var(--atria-primary)]/10 bg-white p-6 shadow-sm shadow-[var(--atria-primary)]/5">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--atria-accent)]/25 text-[var(--atria-primary)]">
            <Users className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--atria-primary)]">
              Pipeline de leads
            </h2>
            <p className="text-[var(--atria-primary)]/50">{totalActive} leads ativos</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage) => {
          const percent = Math.round((stage.count / maxCount) * 100);
          return (
            <div key={stage.status} className="space-y-2">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-[var(--atria-primary)]/80">
                  {stage.label}
                </span>
                <span className="tabular-nums text-lg font-bold text-[var(--atria-primary)]">
                  {stage.count}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--atria-primary)]/10">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: stage.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TvCalendarSection() {
  const anchorDate = new Date();
  const weekRange = getViewDateRange("week", anchorDate);
  const { data: events = [], isLoading } = useCalendarEvents({
    from: weekRange.from.toISOString(),
    to: weekRange.to.toISOString(),
  });
  const weekDays = getWeekDays(anchorDate);
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    for (const event of events) {
      const dayKey = new Date(event.startAt).toDateString();
      const dayEvents = map.get(dayKey) ?? [];
      dayEvents.push(event);
      map.set(dayKey, dayEvents);
    }

    for (const dayEvents of map.values()) {
      dayEvents.sort(
        (a, b) =>
          new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      );
    }

    return map;
  }, [events]);

  const startDay = weekDays[0];
  const endDay = weekDays[6];
  const weekLabel = `${startDay.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  })} – ${endDay.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  return (
    <section className="xl:col-span-3 rounded-3xl border border-[var(--atria-primary)]/10 bg-white p-6 shadow-sm shadow-[var(--atria-primary)]/5">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--atria-accent)]/25 text-[var(--atria-primary)]">
          <Calendar className="size-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[var(--atria-primary)]">
            Calendário
          </h2>
          <p className="text-[var(--atria-primary)]/50">Semana · {weekLabel}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-[var(--atria-primary)]/10 border-t-[var(--atria-primary)]" />
        </div>
      ) : (
        <div className="grid min-h-[280px] gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {weekDays.map((day) => {
            const dayEvents = eventsByDay.get(day.toDateString()) ?? [];
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "flex min-h-[280px] flex-col rounded-2xl border border-[var(--atria-primary)]/10 bg-[var(--atria-primary)]/[0.02]",
                  isToday && "ring-1 ring-[var(--atria-accent)]/60",
                )}
              >
                <div
                  className={cn(
                    "border-b border-[var(--atria-primary)]/10 px-3 py-3",
                    isToday && "bg-[var(--atria-accent)]/15",
                  )}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--atria-primary)]/45">
                    {CALENDAR_WEEKDAY_LONG[day.getDay()]}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-lg font-bold",
                      isToday
                        ? "text-[var(--atria-primary)]"
                        : "text-[var(--atria-primary)]/80",
                    )}
                  >
                    {day.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>

                <div className="calendar-day-scroll flex flex-1 flex-col gap-2 overflow-y-auto p-2">
                  {dayEvents.length === 0 ? (
                    <p className="px-1 py-4 text-center text-xs text-[var(--atria-primary)]/35">
                      Sem compromissos
                    </p>
                  ) : (
                    dayEvents.map((event) => {
                      const accent = getEventDisplayColor(event);

                      return (
                        <article
                          key={event.id}
                          className="rounded-xl border border-[var(--atria-primary)]/10 p-2"
                          style={{
                            borderLeftColor: accent,
                            borderLeftWidth: "3px",
                            backgroundColor: `${accent}14`,
                          }}
                        >
                          <p className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--atria-primary)]">
                            {event.title}
                          </p>
                          <p className="mt-1 text-xs text-[var(--atria-primary)]/50">
                            {formatEventScheduleDetail(event, "compact")}
                          </p>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function formatPeriodLabel(period: { month: number; year: number }) {
  const monthName = MONTH_LABELS[period.month - 1] ?? String(period.month);
  return `${monthName} ${period.year}`;
}
