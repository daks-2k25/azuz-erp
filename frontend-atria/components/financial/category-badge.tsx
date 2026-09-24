"use client";

import { cn } from "@/lib/utils";
import { getContrastColor } from "@/lib/financial-utils";

interface CategoryBadgeProps {
  name: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CategoryBadge({
  name,
  color,
  selected,
  onClick,
  className,
}: CategoryBadgeProps) {
  const textColor = getContrastColor(color);
  const Component = onClick ? "button" : "span";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-all",
        onClick && "cursor-pointer hover:scale-105",
        selected
          ? "ring-2 ring-offset-1"
          : "border-transparent",
        className,
      )}
      style={{
        backgroundColor: color,
        color: textColor,
        boxShadow: selected ? `0 0 0 3px ${color}33` : `0 4px 14px ${color}22`,
        ...(selected ? { ringColor: color } : {}),
      }}
    >
      {name}
    </Component>
  );
}
