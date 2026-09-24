"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { slaService, ApiError } from "@/services";
import type { SlaSettings } from "@/services/sla.service";

const PRIORITY_ROWS = [
  { key: "Critical", label: "Crítica", responseKey: "slaResponseCriticalHours", resolutionKey: "slaResolutionCriticalHours" },
  { key: "High", label: "Alta", responseKey: "slaResponseHighHours", resolutionKey: "slaResolutionHighHours" },
  { key: "Medium", label: "Média", responseKey: "slaResponseMediumHours", resolutionKey: "slaResolutionMediumHours" },
  { key: "Low", label: "Baixa", responseKey: "slaResponseLowHours", resolutionKey: "slaResolutionLowHours" },
  { key: "Planned", label: "Planejado", responseKey: "slaResponsePlannedHours", resolutionKey: "slaResolutionPlannedHours" },
] as const;

export function SlaSettingsForm() {
  const [settings, setSettings] = useState<SlaSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void slaService.getSlaSettings().then(setSettings).catch(() => setSettings(null)).finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await slaService.updateSlaSettings(settings);
      setSettings(updated);
      toast.success("Configurações de SLA salvas");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Não foi possível salvar.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
          Políticas de SLA
        </h2>
        <p className="text-sm text-[var(--atria-primary)]/50">
          Defina prazos de resposta e resolução por prioridade (em horas).
        </p>
      </div>

      <FieldGroup>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-[var(--atria-primary)]/10 text-xs uppercase tracking-wide text-[var(--atria-primary)]/55">
                <th className="px-3 py-2 font-medium">Prioridade</th>
                <th className="px-3 py-2 font-medium">Resposta (h)</th>
                <th className="px-3 py-2 font-medium">Resolução (h)</th>
              </tr>
            </thead>
            <tbody>
              {PRIORITY_ROWS.map((row) => (
                <tr key={row.key} className="border-b border-[var(--atria-primary)]/5">
                  <td className="px-3 py-3 font-medium text-[var(--atria-primary)]">
                    {row.label}
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      type="number"
                      min={1}
                      value={settings[row.responseKey]}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          [row.responseKey]: Number(e.target.value),
                        })
                      }
                      className="h-9"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      type="number"
                      min={1}
                      value={settings[row.resolutionKey]}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          [row.resolutionKey]: Number(e.target.value),
                        })
                      }
                      className="h-9"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[var(--atria-primary)] text-white"
          >
            {saving ? "Salvando..." : "Salvar políticas"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
