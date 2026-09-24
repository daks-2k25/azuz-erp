"use client";

import { STATUS_COLORS, STATUS_LABELS, STATUS_ORDER } from "@/lib/kanban-utils";
import type { KanbanTaskStatus } from "@/services/types";

interface TaskStatusSelectProps {
  id?: string;
  value: KanbanTaskStatus;
  onChange: (status: KanbanTaskStatus) => void;
  className?: string;
}

export function TaskStatusSelect({
  id,
  value,
  onChange,
  className,
}: TaskStatusSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as KanbanTaskStatus)}
      className={
        className ??
        "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
      }
    >
      {STATUS_ORDER.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}

export function TaskStatusBadge({ status }: { status: KanbanTaskStatus }) {
  const color = STATUS_COLORS[status];
  return <></>;
}
