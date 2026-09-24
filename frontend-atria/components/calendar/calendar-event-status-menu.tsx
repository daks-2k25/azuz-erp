"use client";

import {
  getClientDisplayName,
  getEventCardAccent,
  getEventHoverLabel,
} from "@/lib/calendar-utils";
import {
  getCalendarContentTypeLabel,
  getEventContentType,
} from "@/lib/task-content-type";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/services/types";
import { TaskContentTypeIcon } from "@/components/icons/task-content-type-icon";

interface CalendarEventStatusMenuProps {
  event: CalendarEvent;
  onOpenDetails: (event: CalendarEvent) => void;
  className?: string;
  compact?: boolean;
  detail?: string;
}

function CalendarEventRow({
  event,
  compact,
  clientName,
}: {
  event: CalendarEvent;
  compact: boolean;
  clientName: string | null;
}) {
  const contentType = getEventContentType(event);
  const taskLine = event.title;
  const companyClass = compact
    ? "truncate text-[10px] font-bold leading-tight text-[var(--atria-primary)]"
    : "truncate text-xs font-bold leading-tight text-[var(--atria-primary)]";
  const taskClass = compact
    ? "truncate text-[10px] leading-tight text-[var(--atria-primary)]/75"
    : "truncate text-xs leading-tight text-[var(--atria-primary)]/75";

  return (
    <span className="flex min-w-0 items-center gap-2">
      {contentType ? (
        <TaskContentTypeIcon
          type={contentType}
          size={compact ? 28 : 32}
          className="shrink-0"
        />
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        {clientName ? (
          <span className={companyClass} title={clientName}>
            {clientName}
          </span>
        ) : null}
        <span
          className={cn(taskClass, !clientName && "font-bold text-[var(--atria-primary)]")}
          title={taskLine}
        >
          {taskLine}
        </span>
      </span>
    </span>
  );
}

export function CalendarEventStatusMenu({
  event,
  onOpenDetails,
  className,
  compact = true,
  detail,
}: CalendarEventStatusMenuProps) {
  const clientName = event.client
    ? getClientDisplayName(event.client, event.title)
    : null;
  const accent = getEventCardAccent(event);
  const contentType = getEventContentType(event);
  const hoverLabel = [
    getEventHoverLabel(event),
    contentType
      ? `Tipo: ${getCalendarContentTypeLabel(contentType)}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <button
      type="button"
      className={cn(
        "flex min-w-0 flex-col rounded border border-l-[3px] px-1.5 py-1 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atria-primary)]/20",
        className,
      )}
      style={{
        backgroundColor: accent.backgroundColor,
        borderColor: accent.borderColor,
        borderLeftColor: accent.borderLeftColor,
      }}
      title={hoverLabel}
      onClick={(e) => {
        e.stopPropagation();
        onOpenDetails(event);
      }}
    >
      <CalendarEventRow
        event={event}
        compact={compact}
        clientName={clientName}
      />
      {detail && (
        <p className="mt-1 text-[10px] text-[var(--atria-primary)]/50">
          {detail}
        </p>
      )}
    </button>
  );
}
