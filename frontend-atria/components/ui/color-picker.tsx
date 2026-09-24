"use client";

import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#004949",
  "#E8C39E",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#64748B",
  "#0EA5E9",
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            onClick={() => onChange(color)}
            className={cn(
              "size-8 rounded-lg border-2 transition-transform hover:scale-105",
              value === color
                ? "border-[var(--atria-primary)] ring-2 ring-[var(--atria-accent)]"
                : "border-transparent",
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div
          className="size-10 shrink-0 rounded-lg border border-[var(--atria-primary)]/15"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full max-w-[120px] cursor-pointer rounded-lg border border-input p-1"
          aria-label="Selecionar cor personalizada"
        />
        <span className="font-mono text-xs text-[var(--atria-primary)]/60">
          {value.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
