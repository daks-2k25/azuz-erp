"use client";

import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ASSET_TYPE_LABELS } from "@/lib/asset-utils";
import { assetsService } from "@/services";
import type { Asset } from "@/services/types";

interface AssetPickerDialogProps {
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: Asset) => void;
}

export function AssetPickerDialog({
  clientId,
  open,
  onOpenChange,
  onSelect,
}: AssetPickerDialogProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !clientId) return;
    setLoading(true);
    assetsService
      .getAssets({ clientId })
      .then(setAssets)
      .catch(() => setAssets([]))
      .finally(() => setLoading(false));
  }, [open, clientId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[var(--atria-primary)]">
            Selecionar do Drive
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
          </div>
        ) : assets.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--atria-primary)]/50">
            Nenhum asset para este cliente. Envie arquivos em /assets.
          </p>
        ) : (
          <div className="space-y-2">
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  onSelect(asset);
                  onOpenChange(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-[var(--atria-primary)]/10 p-3 text-left transition-colors hover:bg-[var(--atria-accent)]/10"
              >
                <FolderOpen className="size-5 shrink-0 text-[var(--atria-primary)]/40" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--atria-primary)]">
                    {asset.fileName}
                  </p>
                  <p className="text-xs text-[var(--atria-primary)]/50">
                    {ASSET_TYPE_LABELS[asset.fileType]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface AssetPickerButtonProps {
  clientId: string;
  onSelect: (attachment: { name: string; url: string }) => void;
}

export function AssetPickerButton({
  clientId,
  onSelect,
}: AssetPickerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="xs"
        disabled={!clientId}
        onClick={() => setOpen(true)}
        className="border-[var(--atria-accent)] text-[var(--atria-primary)]"
      >
        <FolderOpen className="mr-1 size-3" />
        Do Drive
      </Button>
      <AssetPickerDialog
        clientId={clientId}
        open={open}
        onOpenChange={setOpen}
        onSelect={(asset) =>
          onSelect({
            name: asset.fileName,
            url: assetsService.resolveAssetUrl(asset.fileUrl),
          })
        }
      />
    </>
  );
}
