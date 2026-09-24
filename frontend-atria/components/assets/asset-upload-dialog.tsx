"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
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
import { ASSET_TYPE_LABELS } from "@/lib/asset-utils";
import { LocalMediaPreview } from "@/components/ui/media-preview";
import { assetsService } from "@/services";
import type { AssetFileType, Client } from "@/services/types";

interface AssetUploadDialogProps {
  clients: Client[];
  defaultClientId?: string;
  onSuccess: () => void;
}

export function AssetUploadDialog({
  clients,
  defaultClientId,
  onSuccess,
}: AssetUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState(defaultClientId ?? "");
  const [fileType, setFileType] = useState<AssetFileType>("document");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !clientId) return;

    setLoading(true);
    setError(null);
    try {
      await assetsService.uploadAsset(clientId, fileType, file);
      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90" />
        }
      >
        <Upload className="mr-2 size-4" />
        Enviar Arquivo
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <DialogHeader>
            <DialogTitle className="text-[var(--atria-primary)]">
              Upload de Asset
            </DialogTitle>
          </DialogHeader>
          <FieldGroup className="py-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <Field>
              <FieldLabel htmlFor="asset-client">Cliente</FieldLabel>
              <select
                id="asset-client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                required
              >
                <option value="">Selecione o cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="asset-type">Tipo</FieldLabel>
              <select
                id="asset-type"
                value={fileType}
                onChange={(e) => setFileType(e.target.value as AssetFileType)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {Object.entries(ASSET_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="asset-file">Arquivo</FieldLabel>
              <input
                ref={fileRef}
                id="asset-file"
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                className="w-full text-sm"
                required
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] ?? null)
                }
              />
              {selectedFile && (
                <LocalMediaPreview file={selectedFile} className="mt-2" />
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[var(--atria-primary)] text-white"
            >
              {loading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Upload className="mr-2 size-4" />
              )}
              Enviar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
