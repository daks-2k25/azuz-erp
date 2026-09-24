"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Download,
  Eye,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { PdfViewerDialog } from "@/components/pdf/pdf-viewer-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { isPdfSource } from "@/lib/pdf-utils";
import type { PortalFinanceDocument } from "@/services/types";

interface PortalFinanceDocumentsProps {
  loadDocuments: () => Promise<PortalFinanceDocument[]>;
  uploadDocument: (
    file: File,
    fileType?: "invoice" | "receipt",
    description?: string,
  ) => Promise<PortalFinanceDocument>;
  resolveAssetUrl: (url: string) => string;
}

function resolveDocumentLabel(document: PortalFinanceDocument) {
  if (document.description?.trim()) {
    return document.description.trim();
  }
  const parts = document.fileUrl.split("/");
  return parts[parts.length - 1] || "Arquivo";
}

function formatAttachmentType(fileType: PortalFinanceDocument["fileType"]) {
  return fileType === "invoice" ? "Nota fiscal" : "Comprovante";
}

export function PortalFinanceDocuments({
  loadDocuments,
  uploadDocument,
  resolveAssetUrl,
}: PortalFinanceDocumentsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<PortalFinanceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const items = await loadDocuments();
      setDocuments(items);
    } catch {
      setDocuments([]);
      toast.error("Não foi possível carregar os anexos financeiros.");
    } finally {
      setLoading(false);
    }
  }, [loadDocuments]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleFiles(files: FileList | File[] | null) {
    if (!files?.length) return;

    setUploading(true);
    try {
      const uploaded: PortalFinanceDocument[] = [];
      for (const file of Array.from(files)) {
        const fileType = file.type === "application/pdf" ? "invoice" : "receipt";
        uploaded.push(
          await uploadDocument(file, fileType, file.name),
        );
      }
      setDocuments((current) => [...uploaded, ...current]);
      toast.success(
        uploaded.length === 1
          ? "Arquivo anexado com sucesso."
          : `${uploaded.length} arquivos anexados com sucesso.`,
      );
    } catch {
      toast.error("Não foi possível enviar o arquivo.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="size-5 text-[var(--atria-primary)]" />
        <h3 className="font-semibold text-[var(--atria-primary)]">
          Anexar Notas e Comprovantes
        </h3>
      </div>

      <div
        className={cn(
          "rounded-2xl border-2 border-dashed px-6 py-8 text-center transition",
          dragActive
            ? "border-[var(--atria-primary)] bg-[var(--atria-primary)]/5"
            : "border-[var(--atria-primary)]/15 bg-[var(--atria-primary)]/[0.02]",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          void handleFiles(event.dataTransfer.files);
        }}
      >
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-[var(--atria-accent)]/20">
          <Upload className="size-6 text-[var(--atria-primary)]" />
        </div>
        <p className="text-sm font-medium text-[var(--atria-primary)]">
          Arraste notas fiscais ou comprovantes aqui
        </p>
        <p className="mt-1 text-xs text-[var(--atria-primary)]/50">
          PDF, imagens ou documentos até 100 MB
        </p>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,application/pdf,.doc,.docx"
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          className="mt-4"
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

      <div className="mt-5">
        <p className="mb-3 text-sm font-medium text-[var(--atria-primary)]">
          Arquivos enviados
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin text-[var(--atria-primary)]" />
          </div>
        ) : documents.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--atria-primary)]/45">
            Nenhum arquivo anexado ainda.
          </p>
        ) : (
          <div className="space-y-2">
            {documents.map((document) => {
              const url = resolveAssetUrl(document.fileUrl);
              const label = resolveDocumentLabel(document);
              const isPdf = isPdfSource(url, null, label);

              return (
              <div
                key={document.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--atria-primary)]/8 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--atria-primary)]">
                    {label}
                  </p>
                  <p className="text-xs text-[var(--atria-primary)]/45">
                    {formatAttachmentType(document.fileType)} ·{" "}
                    {new Date(document.uploadedAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {isPdf ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => setPdfPreview({ url, title: label })}
                    >
                      <Eye className="size-3.5" />
                      Visualizar
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    render={
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={label}
                      />
                    }
                  >
                    <Download className="size-3.5" />
                    Baixar
                  </Button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      <PdfViewerDialog
        url={pdfPreview?.url ?? null}
        title={pdfPreview?.title}
        fileName={pdfPreview?.title}
        open={Boolean(pdfPreview)}
        onOpenChange={(open) => {
          if (!open) setPdfPreview(null);
        }}
      />
    </Card>
  );
}
