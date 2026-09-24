"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  LeadOrganizationSelect,
  resolveOrganizationIdForPayload,
} from "@/components/leads/lead-organization-select";
import { toast } from "@/lib/toast";
import { leadsService } from "@/services";

interface LeadKanbanFormDialogProps {
  onSuccess: () => void;
}

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  website: "",
  category: "",
  city: "",
  neighborhood: "",
  address: "",
};

export function LeadKanbanFormDialog({ onSuccess }: LeadKanbanFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [organizationValue, setOrganizationValue] = useState("");

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setOrganizationValue("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    if (!name) {
      toast.error("Informe o nome da empresa ou contato.");
      return;
    }

    const organizationId = resolveOrganizationIdForPayload(organizationValue);
    if (!organizationId) {
      toast.error("Selecione a empresa cliente.");
      return;
    }

    setLoading(true);
    try {
      await leadsService.addToKanban({
        name,
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        website: form.website.trim() || undefined,
        category: form.category.trim() || undefined,
        city: form.city.trim() || undefined,
        neighborhood: form.neighborhood.trim() || undefined,
        address: form.address.trim() || undefined,
        source: "manual",
        organizationId,
      });

      toast.success(`${name} adicionado ao kanban.`);
      resetForm();
      setOpen(false);
      onSuccess();
    } catch {
      /* toast handled by api */
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger
        render={
          <Button
            size="sm"
            className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
          />
        }
      >
        <UserPlus className="size-4" />
        Novo lead
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[var(--atria-primary)]">
            Adicionar lead manualmente
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-4">
          <FieldGroup>
            <LeadOrganizationSelect
              value={organizationValue}
              onChange={setOrganizationValue}
              id="kanban-lead-organization"
            />
            <Field>
              <FieldLabel htmlFor="kanban-lead-name">
                Empresa / Nome *
              </FieldLabel>
              <Input
                id="kanban-lead-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Ex: Restaurante Exemplo"
                required
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="kanban-lead-phone">Telefone</FieldLabel>
                <Input
                  id="kanban-lead-phone"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="11999998888"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="kanban-lead-email">E-mail</FieldLabel>
                <Input
                  id="kanban-lead-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="contato@empresa.com"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="kanban-lead-website">Website</FieldLabel>
              <Input
                id="kanban-lead-website"
                value={form.website}
                onChange={(event) => updateField("website", event.target.value)}
                placeholder="https://empresa.com"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="kanban-lead-category">Categoria</FieldLabel>
                <Input
                  id="kanban-lead-category"
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  placeholder="Ex: Restaurante"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="kanban-lead-city">Cidade</FieldLabel>
                <Input
                  id="kanban-lead-city"
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="São Paulo"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="kanban-lead-neighborhood">Bairro</FieldLabel>
                <Input
                  id="kanban-lead-neighborhood"
                  value={form.neighborhood}
                  onChange={(event) =>
                    updateField("neighborhood", event.target.value)
                  }
                  placeholder="Pinheiros"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="kanban-lead-address">Endereço</FieldLabel>
                <Input
                  id="kanban-lead-address"
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  placeholder="Rua Exemplo, 100"
                />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[var(--atria-primary)] text-white"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Adicionar ao kanban"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
