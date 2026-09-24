"use client";

import { useEffect, useState } from "react";
import { Loader2, Palette, Save } from "lucide-react";
import { ThemePreviewCard } from "@/components/settings/theme-preview-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useAppearance } from "@/contexts/appearance-context";
import {
  ACCENT_PRESETS,
  BACKGROUND_PRESETS,
  DEFAULT_APPEARANCE,
  PRIMARY_PRESETS,
  SIDEBAR_PRESETS,
  TEXT_PRESETS,
  type AppearanceSettings,
} from "@/lib/theme-utils";

function PresetRow({
  label,
  presets,
  value,
  onChange,
}: {
  label: string;
  presets: readonly { name: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all ${
              value === preset.value
                ? "border-[var(--atria-primary)] ring-2 ring-[var(--atria-primary)]/20"
                : "border-border hover:border-[var(--atria-primary)]/30"
            }`}
          >
            <span
              className="size-4 rounded-full border border-black/10"
              style={{ backgroundColor: preset.value }}
            />
            {preset.name}
          </button>
        ))}
      </div>
    </Field>
  );
}

function ColorPicker({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-9 w-12 cursor-pointer rounded-lg border border-input"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 font-mono text-sm uppercase"
          maxLength={7}
        />
      </div>
    </Field>
  );
}

export function AppearanceCustomizer() {
  const { appearance, isLoading, setDraftAppearance, saveAppearance } =
    useAppearance();
  const [draft, setDraft] = useState<AppearanceSettings>(appearance);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setDraft(appearance);
    }
  }, [appearance, isLoading]);

  function updateDraft(partial: Partial<AppearanceSettings>) {
    const next = { ...draft, ...partial };
    setDraft(next);
    setDraftAppearance(next);
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await saveAppearance(draft);
      setMessage("Aparência salva com sucesso!");
    } catch {
      setMessage("Não foi possível salvar as configurações.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setDraft(DEFAULT_APPEARANCE);
    setDraftAppearance(DEFAULT_APPEARANCE);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-[var(--atria-accent)]/20 p-2 text-[var(--atria-primary)]">
            <Palette className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--atria-primary)]">
              Personalizar Tema
            </h2>
            <p className="text-xs text-[var(--atria-primary)]/50">
              Cores salvas por usuário no banco de dados
            </p>
          </div>
        </div>

        <FieldGroup className="gap-5">
          <PresetRow
            label="Cor da Sidebar"
            presets={SIDEBAR_PRESETS}
            value={draft.sidebarColor}
            onChange={(v) => updateDraft({ sidebarColor: v })}
          />
          <ColorPicker
            id="sidebar-custom"
            label="Sidebar personalizada"
            value={draft.sidebarColor}
            onChange={(v) => updateDraft({ sidebarColor: v })}
          />

          <PresetRow
            label="Cor Primária"
            presets={PRIMARY_PRESETS}
            value={draft.primaryColor}
            onChange={(v) => updateDraft({ primaryColor: v })}
          />
          <ColorPicker
            id="primary-custom"
            label="Primária personalizada"
            value={draft.primaryColor}
            onChange={(v) => updateDraft({ primaryColor: v })}
          />

          <PresetRow
            label="Cor de Destaque"
            presets={ACCENT_PRESETS}
            value={draft.accentColor}
            onChange={(v) => updateDraft({ accentColor: v })}
          />
          <ColorPicker
            id="accent-custom"
            label="Destaque personalizado"
            value={draft.accentColor}
            onChange={(v) => updateDraft({ accentColor: v })}
          />

          <PresetRow
            label="Cor de Fundo"
            presets={BACKGROUND_PRESETS}
            value={draft.backgroundColor}
            onChange={(v) => updateDraft({ backgroundColor: v })}
          />
          <ColorPicker
            id="bg-custom"
            label="Fundo personalizado"
            value={draft.backgroundColor}
            onChange={(v) => updateDraft({ backgroundColor: v })}
          />

          <PresetRow
            label="Cor do Texto"
            presets={TEXT_PRESETS}
            value={draft.textColor}
            onChange={(v) => updateDraft({ textColor: v })}
          />
          <ColorPicker
            id="text-custom"
            label="Texto personalizado"
            value={draft.textColor}
            onChange={(v) => updateDraft({ textColor: v })}
          />
        </FieldGroup>

        {message && (
          <p
            className={`mt-4 text-sm ${message.includes("sucesso") ? "text-green-700" : "text-red-600"}`}
          >
            {message}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            onClick={() => void handleSave()}
            disabled={saving}
            className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
          >
            {saving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Salvar Aparência
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Restaurar padrão
          </Button>
        </div>
      </Card>

      <ThemePreviewCard settings={draft} />
    </div>
  );
}
