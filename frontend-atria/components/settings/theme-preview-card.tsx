"use client";

import { Card } from "@/components/ui/card";
import type { AppearanceSettings } from "@/lib/theme-utils";

interface ThemePreviewCardProps {
  settings: AppearanceSettings;
}

export function ThemePreviewCard({ settings }: ThemePreviewCardProps) {
  return (
    <Card
      className="overflow-hidden rounded-2xl border shadow-sm"
      style={{
        borderColor: `${settings.primaryColor}20`,
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: settings.sidebarColor }}
      >
        <span
          className="text-sm font-semibold"
          style={{ color: settings.accentColor }}
        >
          ATRIA ERP
        </span>
        <span
          className="text-xs opacity-80"
          style={{
            color:
              settings.sidebarColor === settings.primaryColor
                ? "#fff"
                : settings.accentColor,
          }}
        >
          Sidebar
        </span>
      </div>

      <div className="p-4">
        <p className="mb-3 text-sm font-medium" style={{ color: settings.textColor }}>
          Pré-visualização ao vivo
        </p>
        <p
          className="mb-4 text-xs opacity-70"
          style={{ color: settings.textColor }}
        >
          Veja como botões, cards e textos ficam com a combinação selecionada.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: settings.primaryColor }}
          >
            Botão Primário
          </button>
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{
              backgroundColor: settings.accentColor,
              color: settings.primaryColor,
            }}
          >
            Botão Accent
          </button>
        </div>

        <div
          className="rounded-xl border p-3"
          style={{
            borderColor: `${settings.primaryColor}15`,
            backgroundColor: `${settings.primaryColor}08`,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: settings.primaryColor }}>
            Card de exemplo
          </p>
          <p className="mt-1 text-xs" style={{ color: settings.textColor }}>
            Texto secundário com cor de foreground personalizada.
          </p>
          <span
            className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: `${settings.accentColor}40`,
              color: settings.primaryColor,
            }}
          >
            Badge
          </span>
        </div>
      </div>
    </Card>
  );
}
