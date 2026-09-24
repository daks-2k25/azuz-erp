"use client";

import { useMemo } from "react";
import type { CalendarEvent } from "@/services/types";
import {
  CALENDAR_WEEKDAY_LONG,
  DAY_VIEW_HOURS,
  formatEventScheduleDetail,
  formatHourLabel,
  getEventDeliveryAt,
  getEventPublicationAt,
  isSameDay,
} from "@/lib/calendar-utils";
import { CalendarEventStatusMenu } from "./calendar-event-status-menu";

interface CalendarDayViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  loading: boolean;
  onOpenDetails: (event: CalendarEvent) => void;
}

const HOUR_HEIGHT = 56;

function getEventTop(startAt: string, hourHeight: number) {
  const date = new Date(startAt);
  return (date.getHours() + date.getMinutes() / 60) * hourHeight;
}

function getEventHeight(startAt: string, endAt: string, hourHeight: number) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const durationHours =
    (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return Math.max(durationHours * hourHeight, hourHeight * 0.65);
}

export function CalendarDayView({
  selectedDate,
  events,
  loading,
  onOpenDetails,
}: CalendarDayViewProps) {
  const dayEvents = useMemo(
    () =>
      events
        .filter((evt) =>
          isSameDay(new Date(getEventPublicationAt(evt)), selectedDate),
        )
        .sort(
          (a, b) =>
            new Date(getEventPublicationAt(a)).getTime() -
            new Date(getEventPublicationAt(b)).getTime(),
        ),
    [events, selectedDate],
  );

  const timelineHeight = DAY_VIEW_HOURS.length * HOUR_HEIGHT;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 shrink-0 rounded-2xl border border-[var(--atria-primary)]/10 bg-white px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--atria-primary)]/45">
          {CALENDAR_WEEKDAY_LONG[selectedDate.getDay()]}
        </p>
        <p className="text-xl font-bold text-[var(--atria-primary)]">
          {selectedDate.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[var(--atria-primary)]/10 bg-white">
          <div className="relative flex">
            <div className="w-16 shrink-0 border-r border-[var(--atria-primary)]/10">
              {DAY_VIEW_HOURS.map((hour) => (
                <div
                  key={hour}
                  className="border-b border-[var(--atria-primary)]/5 pr-2 text-right text-[10px] text-[var(--atria-primary)]/45"
                  style={{ height: HOUR_HEIGHT }}
                >
                  <span className="relative -top-2 inline-block">
                    {formatHourLabel(hour)}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative min-w-0 flex-1">
              {DAY_VIEW_HOURS.map((hour) => (
                <div
                  key={hour}
                  className="border-b border-[var(--atria-primary)]/5"
                  style={{ height: HOUR_HEIGHT }}
                />
              ))}

              <div
                className="pointer-events-none absolute inset-0"
                style={{ height: timelineHeight }}
              >
                {dayEvents.map((evt) => {
                  const publicationAt = getEventPublicationAt(evt);
                  const deliveryAt = getEventDeliveryAt(evt);
                  const top = getEventTop(publicationAt, HOUR_HEIGHT);
                  const height =
                    isSameDay(new Date(publicationAt), new Date(deliveryAt))
                      ? getEventHeight(publicationAt, deliveryAt, HOUR_HEIGHT)
                      : HOUR_HEIGHT * 0.65;

                  return (
                    <div
                      key={evt.id}
                      className="pointer-events-auto absolute right-2 left-2 overflow-hidden"
                      style={{ top, height }}
                    >
                      <CalendarEventStatusMenu
                        event={evt}
                        onOpenDetails={onOpenDetails}
                        compact={false}
                        className="h-full w-full overflow-hidden rounded-lg p-2"
                        detail={formatEventScheduleDetail(evt)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && dayEvents.length === 0 && (
        <p className="mt-3 text-center text-sm text-[var(--atria-primary)]/40">
          Nenhum compromisso agendado para este dia.
        </p>
      )}
    </div>
  );
}
