"use client";

import Link from "next/link";
import { ExternalLink, Video } from "lucide-react";
import { LiquidGlassCard } from "@/components/creation/liquid-glass-card";
import type { Client360Calendar } from "@/services/types";

function formatDateTime(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ClientCalendarTabProps {
  data: Client360Calendar;
}

export function ClientCalendarTab({ data }: ClientCalendarTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <LiquidGlassCard>
        <h2 className="mb-4 text-lg font-semibold text-[var(--atria-primary)]">
          Reuniões & Eventos
        </h2>
        <div className="flex flex-col gap-2">
          {data.meetings.length === 0 ? (
            <p className="text-sm text-[var(--atria-primary)]/50">
              Nenhuma reunião agendada.
            </p>
          ) : (
            data.meetings.map((item) => (
              <ScheduleRow key={`${item.type}-${item.id}`} item={item} />
            ))
          )}
        </div>
      </LiquidGlassCard>

      <LiquidGlassCard accent>
        <h2 className="mb-4 text-lg font-semibold text-[var(--atria-primary)]">
          Lançamentos de Conteúdo
        </h2>
        <div className="flex flex-col gap-2">
          {data.releases.length === 0 ? (
            <p className="text-sm text-[var(--atria-primary)]/50">
              Nenhum lançamento agendado.
            </p>
          ) : (
            data.releases.map((item) => (
              <ScheduleRow key={`${item.type}-${item.id}`} item={item} />
            ))
          )}
        </div>
      </LiquidGlassCard>

      <LiquidGlassCard className="xl:col-span-2">
        <h2 className="mb-4 text-lg font-semibold text-[var(--atria-primary)]">
          Linha do tempo completa
        </h2>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[7px] w-px bg-[var(--atria-primary)]/15" />
          <div className="flex flex-col gap-3">
            {data.items.map((item) => (
              <div key={`${item.type}-${item.id}`} className="relative pl-6">
                <span
                  className="absolute top-3 left-0 size-3.5 rounded-full border-2 border-white"
                  style={{ backgroundColor: item.color }}
                />
                <ScheduleRow item={item} />
              </div>
            ))}
          </div>
        </div>
      </LiquidGlassCard>
    </div>
  );
}

function ScheduleRow({
  item,
}: {
  item: Client360Calendar["items"][number];
}) {
  const href =
    item.referenceUrl?.startsWith("http")
      ? item.referenceUrl
      : item.referenceUrl ?? (item.type === "post" ? `/content/${item.id}` : "/calendar");

  const isExternal = href.startsWith("http");

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/40 bg-white/50 px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {item.type === "post" && (
            <Video className="size-3.5 shrink-0 text-[var(--atria-primary)]/40" />
          )}
          <p className="truncate text-sm font-medium text-[var(--atria-primary)]">
            {item.title}
          </p>
          {item.isPending && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
              Pendente
            </span>
          )}
        </div>
        <p className="text-[10px] text-[var(--atria-primary)]/40">
          {formatDateTime(item.startAt)} · {item.category}
        </p>
      </div>
      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[var(--atria-primary)]/50 hover:text-[var(--atria-primary)]"
        >
          <ExternalLink className="size-4" />
        </a>
      ) : (
        <Link
          href={href}
          className="shrink-0 text-[var(--atria-primary)]/50 hover:text-[var(--atria-primary)]"
        >
          <ExternalLink className="size-4" />
        </Link>
      )}
    </div>
  );
}
