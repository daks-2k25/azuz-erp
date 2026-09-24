"use client";

import { useState } from "react";
import { Bug, Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { useSuggestionMutations } from "@/hooks/use-suggestions";
import type { SystemSuggestionType } from "@/services/types";

const TYPE_OPTIONS: Array<{
  id: SystemSuggestionType;
  label: string;
  description: string;
  icon: typeof Bug;
}> = [
  {
    id: "BUG",
    label: "Bug",
    description: "Algo não está funcionando corretamente",
    icon: Bug,
  },
  {
    id: "SUGGESTION",
    label: "Sugestão",
    description: "Uma ideia para melhorar o sistema",
    icon: Lightbulb,
  },
];

interface SuggestionFormProps {
  onSubmitted?: () => void;
}

export function SuggestionForm({ onSubmitted }: SuggestionFormProps) {
  const { create } = useSuggestionMutations();
  const [type, setType] = useState<SystemSuggestionType>("SUGGESTION");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit() {
    if (!title.trim()) {
      toast.error("Informe um título.");
      return;
    }
    if (!description.trim()) {
      toast.error("Descreva o bug ou a sugestão.");
      return;
    }

    try {
      await create.mutateAsync({
        type,
        title: title.trim(),
        description: description.trim(),
      });
      toast.success("Enviado com sucesso!");
      setTitle("");
      setDescription("");
      setType("SUGGESTION");
      onSubmitted?.();
    } catch {
      toast.error("Não foi possível enviar. Tente novamente.");
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
        Enviar bug ou sugestão
      </h2>
      <p className="mt-1 text-sm text-[var(--atria-primary)]/50">
        Compartilhe problemas ou ideias para melhorar o Atria.
      </p>

      <FieldGroup className="mt-5 gap-5">
        <Field>
          <FieldLabel>Tipo</FieldLabel>
          <div className="grid gap-2 sm:grid-cols-2">
            {TYPE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const selected = type === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setType(option.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left transition",
                    selected
                      ? "border-[var(--atria-primary)] bg-[var(--atria-primary)]/5 shadow-sm"
                      : "border-[var(--atria-primary)]/10 hover:border-[var(--atria-primary)]/25",
                  )}
                >
                  <Icon className="mb-2 size-4 text-[var(--atria-primary)]" />
                  <p className="text-sm font-semibold text-[var(--atria-primary)]">
                    {option.label}
                  </p>
                  <p className="text-[11px] text-[var(--atria-primary)]/50">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="suggestion-title">Título</FieldLabel>
          <Input
            id="suggestion-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex: Erro ao salvar tarefa no Kanban"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="suggestion-description">Descrição</FieldLabel>
          <textarea
            id="suggestion-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            placeholder="Descreva o problema ou a sugestão com o máximo de detalhes possível..."
            className="w-full rounded-xl border border-[var(--atria-primary)]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--atria-primary)]/35"
          />
        </Field>

        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={create.isPending || !title.trim() || !description.trim()}
          className="w-full sm:w-auto"
        >
          {create.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Enviar"
          )}
        </Button>
      </FieldGroup>
    </div>
  );
}
