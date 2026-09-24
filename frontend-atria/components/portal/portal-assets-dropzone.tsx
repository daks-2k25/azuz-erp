"use client";

import { useRef, useState } from "react";
import { Loader2, Send, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { portalService } from "@/services";
import { toast } from "@/lib/toast";
import type { PortalBrief } from "@/services/types";
import type { PortalActionHandlers } from "./portal-actions";

interface PortalAssetsDropzoneProps {
  recentBriefs: PortalBrief[];
  onRefresh: () => void;
  actions?: Pick<PortalActionHandlers, "uploadAsset" | "submitBriefing">;
}

export function PortalAssetsDropzone({
  recentBriefs,
  onRefresh,
  actions,
}: PortalAssetsDropzoneProps) {
  const uploadAsset = actions?.uploadAsset ?? portalService.uploadPortalAsset;
  const submitBriefing =
    actions?.submitBriefing ?? portalService.submitPortalBriefing;
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [briefTitle, setBriefTitle] = useState("");
  const [briefContent, setBriefContent] = useState("");
  const [submittingBrief, setSubmittingBrief] = useState(false);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadAsset(file);
      }
      toast.success("Arquivo(s) enviado(s) com sucesso!");
      onRefresh();
    } catch {
      toast.error("Falha ao enviar arquivo.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleBriefSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!briefTitle.trim() || !briefContent.trim()) {
      toast.error("Preencha título e conteúdo do briefing.");
      return;
    }
    setSubmittingBrief(true);
    try {
      await submitBriefing({
        title: briefTitle.trim(),
        content: briefContent.trim(),
      });
      toast.success("Briefing enviado à agência!");
      setBriefTitle("");
      setBriefContent("");
      onRefresh();
    } catch {
      toast.error("Não foi possível enviar o briefing.");
    } finally {
      setSubmittingBrief(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="rounded-2xl border-2 border-dashed border-[var(--atria-primary)]/20 bg-white p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-2xl bg-[var(--atria-accent)]/20 p-4">
            <Upload className="size-8 text-[var(--atria-primary)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--atria-primary)]">
            Enviar assets
          </h3>
          <p className="mt-2 max-w-sm text-sm text-[var(--atria-primary)]/60">
            Arraste logos, fotos, vídeos ou documentos. Substitui o envio por
            WhatsApp.
          </p>
          <input
            ref={fileRef}
            type="file"
            multiple
            className="mt-4 hidden"
            onChange={(e) => void handleUpload(e.target.files)}
          />
          <Button
            className="mt-4 bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Upload className="size-4" />
                Selecionar arquivos
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl border-[var(--atria-primary)]/10 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-[var(--atria-primary)]">
          Enviar briefing rápido
        </h3>
        <form onSubmit={(e) => void handleBriefSubmit(e)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="brief-title">Título</FieldLabel>
              <Input
                id="brief-title"
                value={briefTitle}
                onChange={(e) => setBriefTitle(e.target.value)}
                placeholder="Ex: Campanha Black Friday"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="brief-content">Descrição</FieldLabel>
              <textarea
                id="brief-content"
                value={briefContent}
                onChange={(e) => setBriefContent(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Descreva o que precisa, prazos, referências..."
              />
            </Field>
            <Button
              type="submit"
              disabled={submittingBrief}
              className="bg-[var(--atria-primary)] text-white"
            >
              {submittingBrief ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Send className="size-4" />
                  Enviar briefing
                </>
              )}
            </Button>
          </FieldGroup>
        </form>
      </Card>

      {recentBriefs.length > 0 && (
        <Card className="rounded-2xl border-[var(--atria-primary)]/10 bg-white p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-[var(--atria-primary)]">
            Briefings enviados recentemente
          </h3>
          <div className="flex flex-col gap-3">
            {recentBriefs.map((brief) => (
              <div
                key={brief.id}
                className="rounded-xl border border-[var(--atria-primary)]/10 bg-[var(--atria-primary)]/[0.02] p-4"
              >
                <p className="font-medium text-[var(--atria-primary)]">
                  {brief.title}
                </p>
                <p className="mt-1 line-clamp-3 text-sm text-[var(--atria-primary)]/70">
                  {brief.content}
                </p>
                <p className="mt-2 text-[10px] text-[var(--atria-primary)]/40">
                  {new Date(brief.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
