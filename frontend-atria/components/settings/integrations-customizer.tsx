"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2, Save, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { ApiError, settingsService } from "@/services";
import type { IntegrationSettings } from "@/services/types";

const DEFAULT_INTEGRATIONS: IntegrationSettings = {
  slackWebhookUrl: null,
  discordWebhookUrl: null,
  notifyOnPostRejected: true,
  notifyOnContractSigned: true,
  updatedAt: "",
};

export function IntegrationsCustomizer() {
  const [settings, setSettings] =
    useState<IntegrationSettings>(DEFAULT_INTEGRATIONS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService
      .getIntegrations()
      .then(setSettings)
      .catch(() => setSettings(DEFAULT_INTEGRATIONS))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      const updated = await settingsService.updateIntegrations({
        slackWebhookUrl: settings.slackWebhookUrl?.trim() || null,
        discordWebhookUrl: settings.discordWebhookUrl?.trim() || null,
        notifyOnPostRejected: settings.notifyOnPostRejected,
        notifyOnContractSigned: settings.notifyOnContractSigned,
      });
      setSettings(updated);
      toast.success("Integrações salvas com sucesso");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível salvar as integrações.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[var(--atria-primary)]" />
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void handleSave(event)} className="flex flex-col gap-6">
      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Webhook className="size-5 text-[var(--atria-primary)]" />
          <div>
            <h2 className="font-semibold text-[var(--atria-primary)]">
              Webhooks
            </h2>
            <p className="text-sm text-[var(--atria-primary)]/50">
              Receba alertas no Slack ou Discord quando eventos importantes
              acontecerem
            </p>
          </div>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="slack-webhook">Slack Webhook URL</FieldLabel>
            <Input
              id="slack-webhook"
              type="url"
              value={settings.slackWebhookUrl ?? ""}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  slackWebhookUrl: event.target.value || null,
                }))
              }
              placeholder="https://hooks.slack.com/services/..."
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="discord-webhook">
              Discord Webhook URL
            </FieldLabel>
            <Input
              id="discord-webhook"
              type="url"
              value={settings.discordWebhookUrl ?? ""}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  discordWebhookUrl: event.target.value || null,
                }))
              }
              placeholder="https://discord.com/api/webhooks/..."
            />
          </Field>
        </FieldGroup>
      </Card>

      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="size-5 text-[var(--atria-primary)]" />
          <div>
            <h2 className="font-semibold text-[var(--atria-primary)]">
              Alertas automáticos
            </h2>
            <p className="text-sm text-[var(--atria-primary)]/50">
              Escolha quais eventos disparam notificações nos canais configurados
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--atria-primary)]/10 p-4">
            <input
              type="checkbox"
              checked={settings.notifyOnPostRejected}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  notifyOnPostRejected: event.target.checked,
                }))
              }
              className="size-4"
            />
            <div>
              <p className="text-sm font-medium text-[var(--atria-primary)]">
                Post rejeitado pelo cliente
              </p>
              <p className="text-xs text-[var(--atria-primary)]/50">
                Dispara alerta quando um post é rejeitado no portal ou internamente
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--atria-primary)]/10 p-4">
            <input
              type="checkbox"
              checked={settings.notifyOnContractSigned}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  notifyOnContractSigned: event.target.checked,
                }))
              }
              className="size-4"
            />
            <div>
              <p className="text-sm font-medium text-[var(--atria-primary)]">
                Contrato assinado
              </p>
              <p className="text-xs text-[var(--atria-primary)]/50">
                Dispara alerta quando um contrato é assinado no portal ou internamente
              </p>
            </div>
          </label>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="gap-2 bg-[var(--atria-primary)] text-white"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {saving ? "Salvando..." : "Salvar integrações"}
        </Button>
      </div>
    </form>
  );
}
