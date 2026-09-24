"use client";

import { Download } from "lucide-react";
import { PdfViewer } from "@/components/pdf/pdf-viewer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { triggerBrowserDownload } from "@/lib/trigger-download";

interface PdfViewerDialogProps {
  url: string | null;
  title?: string | null;
  fileName?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PdfViewerDialog({
  url,
  title,
  fileName,
  open,
  onOpenChange,
}: PdfViewerDialogProps) {
  const heading = title?.trim() || fileName?.trim() || "Documento PDF";
  const downloadName = fileName?.trim() || heading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b border-[var(--atria-primary)]/10 px-6 py-4">
          <DialogTitle className="truncate text-[var(--atria-primary)]">
            {heading}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-[70vh] flex-1 overflow-hidden bg-[#f1f5f5]">
          {url ? (
            <PdfViewer url={url} fileName={downloadName} className="h-[70vh]" />
          ) : null}
        </div>

        <DialogFooter className="border-t border-[var(--atria-primary)]/10 px-6 py-4">
          {url ? (
            <Button
              type="button"
              className="gap-2 bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
              onClick={() => triggerBrowserDownload(url, downloadName)}
            >
              <Download className="size-4" />
              Baixar PDF
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
