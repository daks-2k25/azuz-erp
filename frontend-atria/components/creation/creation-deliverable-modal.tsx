"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ReferenceUrlField } from "@/components/ui/reference-url-field";
import { useInvalidateTasks } from "@/hooks/use-task-mutations";
import { toast } from "@/lib/toast";
import { clientsService, creationService, ApiError } from "@/services";
import type {
  Client,
  CreationDeliverableStatusInput,
  CreationDeliverableTypeKey,
} from "@/services/types";

const TYPE_OPTIONS: { value: CreationDeliverableTypeKey; label: string }[] = [
  { value: "post_instagram", label: "Post Instagram" },
  { value: "post_reels", label: "Reels" },
  { value: "post_carousel", label: "Carrossel" },
  { value: "post_static", label: "Post Estático" },
  { value: "post_story", label: "Story" },
  { value: "reuniao", label: "Reunião" },
  { value: "entrega", label: "Entrega" },
];

interface CreationDeliverableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  onSuccess: () => void;
}

export function CreationDeliverableModal({
  open,
  onOpenChange,
  clientId,
  onSuccess,
}: CreationDeliverableModalProps) {
  const invalidateTasks = useInvalidateTasks();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedClientId, setSelectedClientId] = useState(clientId);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<CreationDeliverableTypeKey>("post_instagram");
  const [scheduledAt, setScheduledAt] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [status, setStatus] =
    useState<CreationDeliverableStatusInput>("draft");

  useEffect(() => {
    if (open) {
      setSelectedClientId(clientId);
      clientsService.getClients().then(setClients).catch(() => setClients([]));
    }
  }, [open, clientId]);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setType("post_instagram");
      setScheduledAt("");
      setReferenceUrl("");
      setStatus("draft");
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClientId || !title.trim() || !scheduledAt) return;

    setLoading(true);
    setError(null);

    try {
      await creationService.createDeliverable({
        clientId: selectedClientId,
        title: title.trim(),
        type,
        scheduledAt: new Date(scheduledAt).toISOString(),
        referenceUrl: referenceUrl.trim() || undefined,
        status,
      });
      toast.success("Item criado e sincronizado com o calendário");
      invalidateTasks();
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar o item.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={(e) => void handleSubmit(e)}>
          <DialogHeader>
            <DialogTitle className="text-[var(--atria-primary)]">
              Criar Item / Compromisso
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="py-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Field>
              <FieldLabel htmlFor="deliverable-client">Cliente</FieldLabel>
              <select
                id="deliverable-client"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                required
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <FieldLabel htmlFor="deliverable-title">Título / Post</FieldLabel>
              <Input
                id="deliverable-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="deliverable-type">Tipo</FieldLabel>
              <select
                id="deliverable-type"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as CreationDeliverableTypeKey)
                }
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <FieldLabel htmlFor="deliverable-datetime">Data e Hora</FieldLabel>
              <Input
                id="deliverable-datetime"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
              />
            </Field>

            <ReferenceUrlField
              id="deliverable-reference"
              value={referenceUrl}
              onChange={setReferenceUrl}
            />

            <Field>
              <FieldLabel htmlFor="deliverable-status">Status</FieldLabel>
              <select
                id="deliverable-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as CreationDeliverableStatusInput)
                }
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="draft">Rascunho</option>
                <option value="pending">Pendente</option>
                <option value="approved">Aprovado</option>
              </select>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedClientId}
              className="bg-[var(--atria-primary)] text-white"
            >
              {loading ? "Salvando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
