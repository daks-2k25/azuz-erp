"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { PortalClickablePostMedia } from "@/components/portal/portal-clickable-post-media";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  FORMAT_LABELS,
  PLATFORM_LABELS,
} from "@/lib/report-utils";
import { portalService } from "@/services";
import { resolvePortalAssetUrl } from "@/services/portal.service";
import { toast } from "@/lib/toast";
import type { ReportContentPost } from "@/services/types";

interface PortalApprovalHubProps {
  token: string;
  posts: ReportContentPost[];
  onRefresh: () => void;
}

export function PortalApprovalHub({
  token,
  posts,
  onRefresh,
}: PortalApprovalHubProps) {
  const [actingId, setActingId] = useState<string | null>(null);
  const [rejectPost, setRejectPost] = useState<ReportContentPost | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  async function handleApprove(postId: string) {
    setActingId(postId);
    try {
      await portalService.approvePortalPost(postId);
      toast.success("Conteúdo aprovado com sucesso!");
      onRefresh();
    } catch {
      toast.error("Não foi possível aprovar o conteúdo.");
    } finally {
      setActingId(null);
    }
  }

  async function handleReject() {
    if (!rejectPost || !rejectReason.trim()) {
      toast.error("Informe o motivo da rejeição.");
      return;
    }
    setRejecting(true);
    try {
      await portalService.rejectPortalPost(
        rejectPost.id,
        rejectReason.trim(),
      );
      toast.success("Feedback enviado à agência.");
      setRejectPost(null);
      setRejectReason("");
      onRefresh();
    } catch {
      toast.error("Não foi possível enviar o feedback.");
    } finally {
      setRejecting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[var(--atria-primary)]">
          Aguardando sua aprovação
        </h2>
        {posts.length === 0 ? (
          <Card className="rounded-2xl border-[var(--atria-primary)]/10 bg-white p-8 text-center text-sm text-[var(--atria-primary)]/50">
            Nenhum conteúdo pendente. Tudo em dia!
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden rounded-2xl border-[var(--atria-primary)]/10 bg-white"
              >
                <div className="grid gap-0 md:grid-cols-[200px_1fr]">
                  <PortalClickablePostMedia
                    attachments={post.attachments}
                    resolveAssetUrl={resolvePortalAssetUrl}
                    fallbackLabel={FORMAT_LABELS[post.format]}
                    className="min-h-[140px]"
                    previewClassName="max-h-36"
                  />
                  <div className="flex flex-col gap-4 p-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-[var(--atria-primary)]">
                          {post.title}
                        </h3>
                        <span className="rounded-full bg-[var(--atria-accent)]/30 px-2 py-0.5 text-[10px] font-medium text-[var(--atria-primary)]">
                          Em aprovação
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--atria-primary)]/50">
                        {PLATFORM_LABELS[post.platform]} ·{" "}
                        {FORMAT_LABELS[post.format]}
                        {post.scheduledDate
                          ? ` · ${new Date(post.scheduledDate).toLocaleDateString("pt-BR")}`
                          : ""}
                      </p>
                    </div>
                    {post.copy && (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--atria-primary)]/80">
                        {post.copy}
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 text-white hover:bg-green-700"
                        disabled={actingId === post.id}
                        onClick={() => void handleApprove(post.id)}
                      >
                        {actingId === post.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-200 text-amber-800 hover:bg-amber-50"
                        onClick={() => setRejectPost(post)}
                      >
                        <X className="size-4" />
                        Solicitar ajustes
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Dialog
        open={!!rejectPost}
        onOpenChange={(open) => !open && setRejectPost(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar ajustes</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--atria-primary)]/60">
            {rejectPost?.title}
          </p>
          <Field>
            <FieldLabel htmlFor="reject-reason">
              O que precisa ser alterado? *
            </FieldLabel>
            <textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
              placeholder="Descreva as alterações necessárias..."
            />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectPost(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => void handleReject()}
              disabled={rejecting || !rejectReason.trim()}
            >
              {rejecting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Enviar feedback"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
