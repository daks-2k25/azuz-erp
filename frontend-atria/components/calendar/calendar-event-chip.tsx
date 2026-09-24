"use client";

import type { CalendarEvent } from "@/services/types";
import { CalendarEventStatusMenu } from "./calendar-event-status-menu";

interface CalendarEventChipProps {
  event: CalendarEvent;
  onOpenDetails: (event: CalendarEvent) => void;
  className?: string;
}

export function CalendarEventChip({
  event,
  onOpenDetails,
  className,
}: CalendarEventChipProps) {
  return (
    <CalendarEventStatusMenu
      event={event}
      onOpenDetails={onOpenDetails}
      className={className}
      compact
    />
  );
}
