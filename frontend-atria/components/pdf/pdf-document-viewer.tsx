"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;
const PAGE_INSET = 24;

function fitPageWidth(
  containerW: number,
  containerH: number,
  origW?: number | null,
  origH?: number | null,
) {
  const maxW = Math.max(160, Math.floor(containerW - PAGE_INSET));
  const maxH = Math.max(160, Math.floor(containerH - PAGE_INSET));
  if (!origW || !origH) return maxW;
  const widthFromHeight = maxH * (origW / origH);
  return Math.max(120, Math.floor(Math.min(maxW, widthFromHeight)));
}

export interface PdfDocumentViewerProps {
  url: string;
  fileName?: string | null;
  className?: string;
  showControls?: boolean;
  theme?: "light" | "dark";
}

export function PdfDocumentViewer({
  url,
  fileName,
  className,
  showControls = true,
  theme = "light",
}: PdfDocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [containerSize, setContainerSize] = useState({ w: 640, h: 480 });
  const [pageNative, setPageNative] = useState<{ w: number; h: number } | null>(
    null,
  );
  const [useFallback, setUseFallback] = useState(false);

  const pageWidth = useMemo(
    () =>
      fitPageWidth(
        containerSize.w,
        containerSize.h,
        pageNative?.w,
        pageNative?.h,
      ),
    [containerSize, pageNative],
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      const height = entries[0]?.contentRect.height;
      if (width) {
        setContainerSize({
          w: width,
          h: height ?? 0,
        });
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";
  const title = fileName?.trim() || "PDF";

  if (useFallback) {
    return (
      <div className={cn("flex h-full min-h-64 w-full flex-col", className)}>
        <iframe
          src={url}
          title={title}
          className="h-full min-h-64 w-full flex-1 border-0 bg-white"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex h-full min-h-0 w-full flex-col", className)}>
      {showControls && (
        <div
          className={cn(
            "flex shrink-0 flex-wrap items-center justify-center gap-1 border-b px-2 py-1.5",
            isDark
              ? "border-white/10 bg-black/30"
              : "border-[var(--atria-primary)]/10 bg-white/80",
          )}
        >
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            aria-label="Página anterior"
            className={
              isDark ? "text-white hover:bg-white/15 hover:text-white" : undefined
            }
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span
            className={cn(
              "min-w-20 text-center text-xs font-medium",
              isDark ? "text-white/80" : "text-[var(--atria-primary)]/70",
            )}
          >
            {numPages > 0 ? `${page} / ${numPages}` : "—"}
          </span>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={numPages === 0 || page >= numPages}
            onClick={() => setPage((current) => Math.min(numPages, current + 1))}
            aria-label="Próxima página"
            className={
              isDark ? "text-white hover:bg-white/15 hover:text-white" : undefined
            }
          >
            <ChevronRight className="size-4" />
          </Button>

          <span
            className={cn(
              "mx-1 h-4 w-px",
              isDark ? "bg-white/20" : "bg-[var(--atria-primary)]/15",
            )}
          />

          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={zoom <= ZOOM_MIN}
            onClick={() =>
              setZoom((current) => Math.max(ZOOM_MIN, current - ZOOM_STEP))
            }
            aria-label="Diminuir zoom"
            className={
              isDark ? "text-white hover:bg-white/15 hover:text-white" : undefined
            }
          >
            <ZoomOut className="size-4" />
          </Button>
          <span
            className={cn(
              "min-w-12 text-center text-xs font-medium",
              isDark ? "text-white/80" : "text-[var(--atria-primary)]/70",
            )}
          >
            {Math.round(zoom * 100)}%
          </span>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={zoom >= ZOOM_MAX}
            onClick={() =>
              setZoom((current) => Math.min(ZOOM_MAX, current + ZOOM_STEP))
            }
            aria-label="Aumentar zoom"
            className={
              isDark ? "text-white hover:bg-white/15 hover:text-white" : undefined
            }
          >
            <ZoomIn className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={zoom === 1}
            onClick={() => setZoom(1)}
            aria-label="Restaurar zoom"
            className={
              isDark ? "text-white hover:bg-white/15 hover:text-white" : undefined
            }
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          "min-h-0 flex-1 overflow-auto",
          isDark ? "bg-zinc-950" : "bg-[#f1f5f5]",
        )}
      >
        <Document
          file={url}
          onLoadSuccess={(doc) => {
            setNumPages(doc.numPages);
            setPage(1);
          }}
          onLoadError={() => setUseFallback(true)}
          onSourceError={() => setUseFallback(true)}
          loading={
            <div className="flex h-64 items-center justify-center">
              <Loader2
                className={cn(
                  "size-6 animate-spin",
                  isDark ? "text-white/60" : "text-[var(--atria-primary)]/50",
                )}
              />
            </div>
          }
          error={<PdfLoadError url={url} fileName={title} isDark={isDark} />}
          className="flex min-h-full items-center justify-center p-3"
        >
          <Page
            pageNumber={page}
            width={pageWidth}
            scale={zoom}
            renderTextLayer
            renderAnnotationLayer
            className="overflow-hidden rounded-md shadow-lg"
            onLoadSuccess={(loadedPage) => {
              setPageNative({
                w: loadedPage.originalWidth,
                h: loadedPage.originalHeight,
              });
            }}
            loading={
              <div className="flex h-64 w-full items-center justify-center">
                <Loader2
                  className={cn(
                    "size-6 animate-spin",
                    isDark ? "text-white/60" : "text-[var(--atria-primary)]/50",
                  )}
                />
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
}

function PdfLoadError({
  url,
  fileName,
  isDark,
}: {
  url: string;
  fileName: string;
  isDark: boolean;
}) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 px-6 text-center">
      <p
        className={cn(
          "text-sm",
          isDark ? "text-white/70" : "text-[var(--atria-primary)]/70",
        )}
      >
        Não foi possível pré-visualizar este PDF.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        render={
          <a href={url} target="_blank" rel="noopener noreferrer" />
        }
      >
        <ExternalLink className="size-3.5" />
        Abrir {fileName} em nova aba
      </Button>
    </div>
  );
}
