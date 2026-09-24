"use client";

import { cn } from "@/lib/utils";
import { TASK_CONTENT_TYPE_OPTIONS } from "@/lib/task-content-type";
import type { KanbanTaskContentType } from "@/services/types";

interface TaskContentTypePickerProps {
  value: KanbanTaskContentType;
  onChange: (value: KanbanTaskContentType) => void;
  disabled?: boolean;
}

export function TaskContentTypePicker({
  value,
  onChange,
  disabled = false,
}: TaskContentTypePickerProps) {
  return (
    <div
      role="group"
      aria-label="Tipo de conteúdo"
      className="grid grid-cols-4 gap-2"
    >
      {TASK_CONTENT_TYPE_OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-left transition",
              selected
                ? "border-[var(--atria-primary)] bg-[var(--atria-primary)]/5 shadow-sm"
                : "border-input hover:border-[var(--atria-primary)]/25",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            <p className="text-sm font-semibold text-[var(--atria-primary)]">
              {option.label}
            </p>
            {option.description ? (
              <p className="mt-0.5 text-[11px] text-[var(--atria-primary)]/50">
                {option.description}
              </p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
