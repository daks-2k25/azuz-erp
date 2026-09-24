"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  APP_UPDATE_VISIBLE_ROLES,
  getAppUpdateRoleLabel,
} from "@/lib/app-updates";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { useAppUpdateMutations } from "@/hooks/use-app-updates";
import type { AppUpdate, AppUpdateVisibleRole } from "@/services/types";

interface AppUpdateFormProps {
  editing?: AppUpdate | null;
  onSubmitted?: () => void;
  onCancelEdit?: () => void;
}

export function AppUpdateForm({
  editing = null,
  onSubmitted,
  onCancelEdit,
}: AppUpdateFormProps) {
  const { create, update } = useAppUpdateMutations();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [visibleRoles, setVisibleRoles] = useState<AppUpdateVisibleRole[]>([
    "admin",
    "manager",
    "user",
    "content_creator",
    "designer_master",
    "designer_junior",
    "crm",
  ]);
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (!editing) {
      setTitle("");
      setBody("");
      setVisibleRoles([
        "admin",
        "manager",
        "user",
        "content_creator",
        "designer_master",
        "designer_junior",
        "crm",
      ]);
      setIsPublished(true);
      return;
    }

    setTitle(editing.title);
    setBody(editing.body);
    setVisibleRoles(editing.visibleRoles);
    setIsPublished(editing.isPublished);
  }, [editing]);

  function toggleRole(role: AppUpdateVisibleRole) {
    setVisibleRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role],
    );
  }

  async function handleSubmit() {
    if (!title.trim()) {
      toast.error("Informe um título.");
      return;
    }
    if (!body.trim()) {
      toast.error("Escreva o conteúdo da atualização.");
      return;
    }
    if (visibleRoles.length === 0) {
      toast.error("Selecione ao menos um perfil.");
      return;
    }

    try {
      if (editing) {
        await update.mutateAsync({
          id: editing.id,
          data: {
            title: title.trim(),
            body: body.trim(),
            visibleRoles,
            isPublished,
          },
        });
        toast.success("Atualização editada com sucesso!");
      } else {
        await create.mutateAsync({
          title: title.trim(),
          body: body.trim(),
          visibleRoles,
          isPublished,
        });
        toast.success("Atualização publicada com sucesso!");
      }

      onSubmitted?.();
    } catch {
      toast.error("Não foi possível salvar. Tente novamente.");
    }
  }

  const isPending = create.isPending || update.isPending;

  return (
    <div className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
        {editing ? "Editar atualização" : "Nova atualização"}
      </h2>
      <p className="mt-1 text-sm text-[var(--atria-primary)]/50">
        Compartilhe novidades do app e escolha quais perfis podem visualizar.
      </p>

      <FieldGroup className="mt-5 gap-5">
        <Field>
          <FieldLabel htmlFor="app-update-title">Título</FieldLabel>
          <Input
            id="app-update-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex: Novo fluxo de aprovação no Kanban"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="app-update-body">Conteúdo</FieldLabel>
          <textarea
            id="app-update-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={8}
            placeholder="Descreva o que mudou, como usar ou o que a equipe precisa saber..."
            className="w-full rounded-xl border border-[var(--atria-primary)]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--atria-primary)]/35"
          />
        </Field>

        <Field>
          <FieldLabel>Quem pode ver</FieldLabel>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {APP_UPDATE_VISIBLE_ROLES.map((role) => {
              const selected = visibleRoles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition",
                    selected
                      ? "border-[var(--atria-primary)] bg-[var(--atria-primary)]/5 text-[var(--atria-primary)]"
                      : "border-[var(--atria-primary)]/10 text-[var(--atria-primary)]/60 hover:border-[var(--atria-primary)]/25",
                  )}
                >
                  {getAppUpdateRoleLabel(role)}
                </button>
              );
            })}
          </div>
        </Field>

        <Field>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--atria-primary)]/10 px-4 py-3">
            <div>
              <FieldLabel className="mb-0">Publicado</FieldLabel>
              <p className="text-xs text-[var(--atria-primary)]/50">
                Rascunhos ficam visíveis apenas para masters.
              </p>
            </div>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
        </Field>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={
              isPending ||
              !title.trim() ||
              !body.trim() ||
              visibleRoles.length === 0
            }
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : editing ? (
              "Salvar alterações"
            ) : (
              "Publicar atualização"
            )}
          </Button>
          {editing ? (
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancelar
            </Button>
          ) : null}
        </div>
      </FieldGroup>
    </div>
  );
}
