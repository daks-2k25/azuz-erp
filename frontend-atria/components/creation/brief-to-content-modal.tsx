"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
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
import { useInvalidateTasks } from "@/hooks/use-task-mutations";
import { LIQUID_GLASS_CLASS } from "@/lib/content-utils";
import { toast } from "@/lib/toast";
import { clientsService, creationService, ApiError } from "@/services";
import type {
  BriefContentIdea,
  BriefContentPlan,
  Client,
  ContentPlatform,
  ContentPostFormat,
} from "@/services/types";

const FORMAT_LABELS: Record<ContentPostFormat, string> = {
  carousel: "Carrossel",
  reels: "Reels",
  static: "Estático",
  story: "Story",
};

const PROVIDER_LABELS = {
  openai: "OpenAI",
  gemini: "Gemini",
  fallback: "Modo inteligente (sem API)",
} as const;

type Step = "input" | "generating" | "results" | "creating" | "done";

interface BriefToContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BriefToContentModal({
  open,
  onOpenChange,
  onSuccess,
}: BriefToContentModalProps) {
  const invalidateTasks = useInvalidateTasks();
  const [step, setStep] = useState<Step>("input");
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [platform, setPlatform] = useState<ContentPlatform>("instagram");
  const [objective, setObjective] = useState("");
  const [brief, setBrief] = useState("");
  const [plan, setPlan] = useState<BriefContentPlan | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [createResult, setCreateResult] = useState<{
    posts: number;
    tasks: number;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    clientsService
      .getClients()
      .then((list) => {
        setClients(list);
        if (!clientId && list[0]) setClientId(list[0].id);
      })
      .catch(() => setClients([]));
  }, [open, clientId]);

  useEffect(() => {
    if (!open) {
      setStep("input");
      setBrief("");
      setObjective("");
      setPlan(null);
      setSelected(new Set());
      setError(null);
      setCreateResult(null);
    }
  }, [open]);

  function toggleIdea(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function selectAll() {
    if (!plan) return;
    setSelected(new Set(plan.ideas.map((_, i) => i)));
  }

  async function handleGenerate() {
    if (!brief.trim() || !clientId) return;

    setStep("generating");
    setError(null);

    try {
      const result = await creationService.generateFromBrief({
        brief: brief.trim(),
        clientId,
        platform,
        objective: objective.trim() || undefined,
      });
      setPlan(result);
      setSelected(new Set(result.ideas.map((_, i) => i)));
      setStep("results");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível gerar o plano de conteúdo.",
      );
      setStep("input");
    }
  }

  async function handleCreate() {
    if (!plan || selected.size === 0) return;

    const ideas: BriefContentIdea[] = plan.ideas.filter((_, i) =>
      selected.has(i),
    );

    setStep("creating");
    setError(null);

    try {
      const result = await creationService.createFromBriefPlan({
        clientId: plan.clientId,
        platform: plan.platform,
        ideas,
        createKanbanTasks: true,
      });
      setCreateResult(result.created);
      setStep("done");
      toast.success(
        `${result.created.posts} posts e ${result.created.tasks} tarefas criados`,
      );
      invalidateTasks();
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar os itens no pipeline.",
      );
      setStep("results");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--atria-primary)]">
            <Sparkles className="size-5 text-[var(--atria-accent)]" />
            Brief → Conteúdo com IA
          </DialogTitle>
        </DialogHeader>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex-1 overflow-y-auto py-2">
          {step === "input" && (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="brief-client">Cliente *</FieldLabel>
                <select
                  id="brief-client"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  required
                >
                  {clients.length === 0 ? (
                    <option value="">Cadastre um cliente primeiro</option>
                  ) : (
                    clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.companyName}
                      </option>
                    ))
                  )}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="brief-platform">Plataforma</FieldLabel>
                <select
                  id="brief-platform"
                  value={platform}
                  onChange={(e) =>
                    setPlatform(e.target.value as ContentPlatform)
                  }
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="brief-objective">
                  Objetivo da campanha
                </FieldLabel>
                <Input
                  id="brief-objective"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Ex: Lançamento de coleção de verão"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="brief-text">Briefing do cliente *</FieldLabel>
                <textarea
                  id="brief-text"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={8}
                  required
                  placeholder="Cole aqui o briefing completo: tom de voz, público-alvo, mensagens-chave, referências, prazos..."
                  className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm leading-relaxed"
                />
              </Field>
            </FieldGroup>
          )}

          {step === "generating" && (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-center">
              <Loader2 className="size-10 animate-spin text-[var(--atria-primary)]" />
              <div>
                <p className="font-medium text-[var(--atria-primary)]">
                  Analisando briefing...
                </p>
                <p className="text-sm text-[var(--atria-primary)]/50">
                  Gerando 5 ideias de conteúdo e calendário sugerido
                </p>
              </div>
            </div>
          )}

          {step === "results" && plan && (
            <div className="flex flex-col gap-4">
              <div className={LIQUID_GLASS_CLASS + " p-4"}>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--atria-primary)]/40">
                  Resumo · {PROVIDER_LABELS[plan.provider]}
                </p>
                <p className="mt-1 text-sm text-[var(--atria-primary)]">
                  {plan.summary}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--atria-primary)]">
                  {selected.size} de {plan.ideas.length} ideias selecionadas
                </p>
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs font-medium text-[var(--atria-primary)]/60 hover:underline"
                >
                  Selecionar todas
                </button>
              </div>

              <div className="space-y-3">
                {plan.ideas.map((idea, index) => (
                  <label
                    key={index}
                    className={`block cursor-pointer rounded-2xl border p-4 transition-colors ${
                      selected.has(index)
                        ? "border-[var(--atria-accent)] bg-[var(--atria-accent)]/10"
                        : "border-[var(--atria-primary)]/10 bg-white/60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(index)}
                        onChange={() => toggleIdea(index)}
                        className="mt-1 size-4"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-[var(--atria-primary)]">
                            {idea.title}
                          </h4>
                          <span className="rounded-full bg-[var(--atria-primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--atria-primary)]">
                            {FORMAT_LABELS[idea.format]}
                          </span>
                        </div>
                        <p className="mb-2 line-clamp-3 text-sm text-[var(--atria-primary)]/70">
                          {idea.copy}
                        </p>
                        <p className="mb-2 text-xs text-[var(--atria-primary)]/50">
                          <span className="font-medium">Mídia:</span>{" "}
                          {idea.mediaConcept}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--atria-primary)]/60">
                          <Calendar className="size-3.5" />
                          {new Date(idea.suggestedDate).toLocaleString(
                            "pt-BR",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === "creating" && (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 animate-spin text-[var(--atria-primary)]" />
              <p className="text-sm text-[var(--atria-primary)]/60">
                Criando posts e tarefas no pipeline...
              </p>
            </div>
          )}

          {step === "done" && createResult && (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 text-center">
              <CheckCircle2 className="size-12 text-green-600" />
              <div>
                <p className="text-lg font-semibold text-[var(--atria-primary)]">
                  Pipeline atualizado!
                </p>
                <p className="text-sm text-[var(--atria-primary)]/50">
                  {createResult.posts} posts criados · {createResult.tasks}{" "}
                  tarefas no Kanban
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step === "input" && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={!brief.trim() || !clientId}
                onClick={() => void handleGenerate()}
                className="gap-2 bg-[var(--atria-primary)] text-white"
              >
                <Wand2 className="size-4" />
                Gerar plano
              </Button>
            </>
          )}

          {step === "results" && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("input")}
              >
                Voltar
              </Button>
              <Button
                type="button"
                disabled={selected.size === 0}
                onClick={() => void handleCreate()}
                className="gap-2 bg-[var(--atria-primary)] text-white"
              >
                <Sparkles className="size-4" />
                Criar no pipeline ({selected.size})
              </Button>
            </>
          )}

          {step === "done" && (
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-[var(--atria-primary)] text-white"
            >
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
