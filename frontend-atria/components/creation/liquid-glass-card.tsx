import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LIQUID_GLASS_CLASS } from "@/lib/content-utils";

interface LiquidGlassCardProps {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}

export function LiquidGlassCard({
  children,
  className,
  accent = false,
}: LiquidGlassCardProps) {
  return (
    <div
      className={cn(
        accent
          ? "rounded-2xl border border-[var(--atria-accent)]/30 bg-[var(--atria-accent)]/10 shadow-lg shadow-[var(--atria-accent)]/10 backdrop-blur-md"
          : LIQUID_GLASS_CLASS,
        "p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
