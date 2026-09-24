"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PdfDocumentViewerProps } from "@/components/pdf/pdf-document-viewer";

const PdfDocumentViewer = dynamic(
  () =>
    import("@/components/pdf/pdf-document-viewer").then(
      (mod) => mod.PdfDocumentViewer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-64 w-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[var(--atria-primary)]/50" />
      </div>
    ),
  },
);

export type PdfViewerProps = PdfDocumentViewerProps;

export function PdfViewer({ className, url, ...props }: PdfViewerProps) {
  return (
    <PdfDocumentViewer
      key={url}
      url={url}
      {...props}
      className={cn("min-h-64", className)}
    />
  );
}
