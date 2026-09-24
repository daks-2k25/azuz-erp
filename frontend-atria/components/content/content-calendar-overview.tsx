"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ContentCalendarItem } from "@/services/types";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const PLATFORM_LABELS = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

interface ContentCalendarOverviewProps {
  items: ContentCalendarItem[];
}

export function ContentCalendarOverview({ items }: ContentCalendarOverviewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const days: (Date | null)[] = [];

    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [currentDate]);

  const itemsByDay = useMemo(() => {
    const map = new Map<string, ContentCalendarItem[]>();
    for (const item of items) {
      const key = new Date(item.scheduledDate).toDateString();
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return map;
  }, [items]);

  function prevMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  return (
    <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-[var(--atria-primary)]">
          Calendário de Publicações
        </h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={prevMonth} className="rounded-lg p-1 hover:bg-muted">
            <ChevronLeft className="size-4 text-[var(--atria-primary)]" />
          </button>
          <span className="text-sm font-medium text-[var(--atria-primary)]">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button type="button" onClick={nextMonth} className="rounded-lg p-1 hover:bg-muted">
            <ChevronRight className="size-4 text-[var(--atria-primary)]" />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-[10px] font-semibold text-[var(--atria-primary)]/50 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="min-h-16" />;
          }

          const dayItems = itemsByDay.get(day.toDateString()) ?? [];
          const isToday =
            day.toDateString() === new Date().toDateString();

          return (
            <div
              key={day.toISOString()}
              className={`min-h-16 rounded-lg border p-1 ${
                isToday
                  ? "border-[var(--atria-primary)] bg-[var(--atria-primary)]/5"
                  : "border-[var(--atria-primary)]/10"
              }`}
            >
              <span
                className={`text-[10px] font-bold ${
                  isToday ? "text-[var(--atria-primary)]" : "text-[var(--atria-primary)]/60"
                }`}
              >
                {day.getDate()}
              </span>
              <div className="mt-0.5 flex flex-col gap-0.5">
                {dayItems.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="truncate rounded px-1 py-0.5 text-[8px] font-medium text-white"
                    style={{ backgroundColor: item.color }}
                    title={item.title}
                  >
                    {item.title}
                  </div>
                ))}
                {dayItems.length > 2 && (
                  <span className="text-[8px] text-[var(--atria-primary)]/40">
                    +{dayItems.length - 2}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-[var(--atria-primary)]/10 pt-4">
        {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
          <span
            key={key}
            className="text-[10px] text-[var(--atria-primary)]/60"
          >
            ● {label}
          </span>
        ))}
      </div>
    </Card>
  );
}
