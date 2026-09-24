"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  iconClassName?: string;
}

export function ThemeToggle({ className, iconClassName }: ThemeToggleProps) {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={toggleMode}
      className={className}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
    >
      {isDark ? (
        <Sun
          className={cn("size-4 text-[var(--atria-primary)]", iconClassName)}
        />
      ) : (
        <Moon
          className={cn("size-4 text-[var(--atria-primary)]", iconClassName)}
        />
      )}
    </Button>
  );
}
