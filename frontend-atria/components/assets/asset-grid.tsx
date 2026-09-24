"use client";

import { useState } from "react";
import {
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { PdfViewerDialog } from "@/components/pdf/pdf-viewer-dialog";
import { ClientName } from "@/components/ui/client-name";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ASSET_TYPE_LABELS,
  ASSET_TYPE_STYLES,
} from "@/lib/asset-utils";
import { isPdfSource } from "@/lib/pdf-utils";
import { assetsService } from "@/services";
import type { ClientAssetGroup } from "@/services/types";

interface AssetGridProps {
  groups: ClientAssetGroup[];
  onRefresh: () => void;
}

function AssetIcon({ fileType }: { fileType: string }) {
  if (fileType === "image" || fileType === "logo") {
    return <ImageIcon className="size-8 text-[var(--atria-primary)]/40" />;
  }
  return <FileText className="size-8 text-[var(--atria-primary)]/40" />;
}

export function AssetGrid({ groups, onRefresh }: AssetGridProps) {
  const [pdfPreview, setPdfPreview] = useState<{
    url: string;
    title: string;
  } | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este arquivo?")) return;
    await assetsService.deleteAsset(id);
    onRefresh();
  }

  if (groups.length === 0) {
    return (
      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-12 text-center">
        <FolderOpen className="mx-auto mb-3 size-12 text-[var(--atria-primary)]/20" />
        <p className="text-[var(--atria-primary)]/50">
          Nenhum asset enviado ainda. Faça upload do primeiro arquivo.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.client.id}>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-[var(--atria-accent)]/20 p-2">
              <FolderOpen className="size-5 text-[var(--atria-primary)]" />
            </div>
            <div>
              <ClientName
                as="h2"
                className="text-lg text-[var(--atria-primary)]"
              >
                {group.client.companyName}
              </ClientName>
              <p className="text-xs text-[var(--atria-primary)]/50">
                {group.assets.length} arquivo
                {group.assets.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {group.assets.map((asset) => {
              const isImage =
                asset.fileType === "image" || asset.fileType === "logo";
              const url = assetsService.resolveAssetUrl(asset.fileUrl);
              const isPdf = isPdfSource(url, null, asset.fileName);

              return (
                <Card
                  key={asset.id}
                  className="group overflow-hidden rounded-2xl border border-[var(--atria-primary)]/10 bg-white"
                >
                  <div className="flex h-32 items-center justify-center bg-[var(--atria-primary)]/[0.03]">
                    {isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={asset.fileName}
                        className="max-h-full max-w-full object-contain p-2"
                      />
                    ) : (
                      <AssetIcon fileType={asset.fileType} />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-[var(--atria-primary)]">
                      {asset.fileName}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${ASSET_TYPE_STYLES[asset.fileType]}`}
                      >
                        {ASSET_TYPE_LABELS[asset.fileType]}
                      </span>
                      <span className="text-[10px] text-[var(--atria-primary)]/40">
                        {assetsService.formatFileSize(asset.fileSize)}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          if (isPdf) {
                            setPdfPreview({ url, title: asset.fileName });
                            return;
                          }
                          window.open(url, "_blank");
                        }}
                      >
                        {isPdf ? "Visualizar" : "Abrir"}
                      </Button>
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => void handleDelete(asset.id)}
                      >
                        <Trash2 className="size-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}

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
