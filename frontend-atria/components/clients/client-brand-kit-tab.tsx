"use client";

import { useState } from "react";
import { ExternalLink, FolderOpen, Image as ImageIcon } from "lucide-react";
import { LiquidGlassCard } from "@/components/creation/liquid-glass-card";
import { PdfViewerDialog } from "@/components/pdf/pdf-viewer-dialog";
import { ASSET_TYPE_LABELS } from "@/lib/asset-utils";
import { isPdfSource } from "@/lib/pdf-utils";
import { assetsService } from "@/services";
import type { Client, Client360Assets } from "@/services/types";
import { AssetUploadDialog } from "@/components/assets/asset-upload-dialog";

interface ClientBrandKitTabProps {
  clientId: string;
  data: Client360Assets;
  clients: Client[];
  onRefresh: () => void;
}

export function ClientBrandKitTab({
  clientId,
  data,
  clients,
  onRefresh,
}: ClientBrandKitTabProps) {
  const [pdfPreview, setPdfPreview] = useState<{
    url: string;
    title: string;
  } | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {data.referenceLinks.length > 0 && (
        <LiquidGlassCard accent>
          <h2 className="mb-4 text-lg font-semibold text-[var(--atria-primary)]">
            Links de referência
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.referenceLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-sm font-medium text-[var(--atria-primary)] transition-colors hover:bg-white/90"
              >
                {link.label}
                <ExternalLink className="size-3.5 opacity-50" />
              </a>
            ))}
          </div>
        </LiquidGlassCard>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
            Arquivos & Brand Kit
          </h2>
          <p className="text-sm text-[var(--atria-primary)]/50">
            {data.totals.logos} logos · {data.totals.brandGuides} guias ·{" "}
            {data.totals.images} imagens · {data.totals.documents} documentos
          </p>
        </div>
        <AssetUploadDialog
          clients={clients}
          defaultClientId={clientId}
          onSuccess={onRefresh}
        />
      </div>

      {data.assets.length === 0 ? (
        <LiquidGlassCard className="text-center">
          <FolderOpen className="mx-auto mb-3 size-12 text-[var(--atria-primary)]/20" />
          <p className="text-sm text-[var(--atria-primary)]/50">
            Nenhum asset enviado. Faça upload de logos, guias e arquivos.
          </p>
        </LiquidGlassCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.assets.map((asset) => {
            const url = assetsService.resolveAssetUrl(asset.fileUrl);
            const isImage =
              asset.fileType === "image" || asset.fileType === "logo";
            const isPdf = isPdfSource(url, null, asset.fileName);

            return (
              <LiquidGlassCard key={asset.id} className="!p-0 overflow-hidden">
                <div className="flex h-28 items-center justify-center bg-[var(--atria-primary)]/[0.03]">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={asset.fileName}
                      className="max-h-full max-w-full object-contain p-2"
                    />
                  ) : (
                    <ImageIcon className="size-10 text-[var(--atria-primary)]/30" />
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-[var(--atria-primary)]">
                    {asset.fileName}
                  </p>
                  <p className="text-[10px] text-[var(--atria-primary)]/40">
                    {ASSET_TYPE_LABELS[
                      asset.fileType as keyof typeof ASSET_TYPE_LABELS
                    ] ?? asset.fileType}
                  </p>
                  {isPdf ? (
                    <button
                      type="button"
                      onClick={() =>
                        setPdfPreview({ url, title: asset.fileName })
                      }
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--atria-primary)] hover:underline"
                    >
                      Visualizar PDF
                    </button>
                  ) : (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--atria-primary)] hover:underline"
                    >
                      Abrir <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </LiquidGlassCard>
            );
          })}
        </div>
      )}

      <PdfViewerDialog
        url={pdfPreview?.url ?? null}
        title={pdfPreview?.title}
        fileName={pdfPreview?.title}
        open={Boolean(pdfPreview)}
        onOpenChange={(open) => {
          if (!open) setPdfPreview(null);
        }}
      />
    </div>
  );
}
