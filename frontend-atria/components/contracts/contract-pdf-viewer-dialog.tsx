"use client";

import { useRef } from "react";
import { Download, Printer } from "lucide-react";
import { PdfViewer } from "@/components/pdf/pdf-viewer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ContractDocument } from "@/components/contracts/contract-document";
import {
  buildContractPdfFilename,
  formatCurrency,
  formatDate,
  FREQUENCY_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/lib/contract-utils";
import { printContractFromElement } from "@/lib/print-contract";
import { toast } from "@/lib/toast";
import type { Contract } from "@/services/types";

interface ContractPdfViewerDialogProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function isExternalPdfUrl(pdfUrl: string) {
  return pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://");
}

export function ContractPdfViewerDialog({
  contract,
  open,
  onOpenChange,
}: ContractPdfViewerDialogProps) {
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    if (!contract) return;

    if (contract.pdfUrl && isExternalPdfUrl(contract.pdfUrl)) {
      const popup = window.open(
        contract.pdfUrl,
        "_blank",
        "noopener,noreferrer",
      );
      if (!popup) {
        toast.error("Permita pop-ups para imprimir o PDF.");
        return;
      }
      popup.addEventListener("load", () => popup.print());
      return;
    }

    if (!printContractFromElement(printRef.current)) {
      toast.error("Não foi possível preparar o contrato para impressão.");
    }
  }

  function handleDownload() {
    if (!contract) return;

    if (contract.pdfUrl && isExternalPdfUrl(contract.pdfUrl)) {
      const link = document.createElement("a");
      link.href = contract.pdfUrl;
      link.download = buildContractPdfFilename(contract);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
      return;
    }

    toast.info(
      'Use "Salvar como PDF" na janela de impressão para baixar o documento.',
    );
    if (!printContractFromElement(printRef.current)) {
      toast.error("Não foi possível preparar o contrato para impressão.");
    }
  }

  if (!contract) return null;

  const hasUploadedPdf = Boolean(contract.pdfUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="contract-viewer-dialog flex max-h-[95vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="no-print border-b border-[var(--atria-primary)]/10 px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="text-[var(--atria-primary)]">
              {contract.title}
            </DialogTitle>
            <Badge className={STATUS_STYLES[contract.status]}>
              {STATUS_LABELS[contract.status]}
            </Badge>
          </div>
          <p className="text-sm text-[var(--atria-primary)]/60">
            {contract.client.companyName} ·{" "}
            {formatCurrency(contract.recurringValue)} ·{" "}
            {FREQUENCY_LABELS[contract.paymentFrequency]} · Início{" "}
            {formatDate(contract.startDate)}
          </p>
        </DialogHeader>

        <div className="contract-print-scroll relative min-h-[65vh] flex-1 overflow-y-auto bg-[#f1f5f5]">
          {hasUploadedPdf ? (
            <PdfViewer
              url={contract.pdfUrl!}
              fileName={buildContractPdfFilename(contract)}
              className="h-[65vh]"
            />
          ) : (
            <div ref={printRef} className="contract-print-root p-6 md:p-10">
              <ContractDocument
                contract={contract}
                className="mx-auto w-full max-w-none rounded-xl border border-[#e2e8f0] p-8 shadow-sm"
              />
            </div>
          )}
        </div>

        <DialogFooter className="no-print border-t border-[var(--atria-primary)]/10 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={handlePrint}
          >
            <Printer className="size-4" />
            Imprimir
          </Button>
          <Button
            type="button"
            className="gap-2 bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
            onClick={handleDownload}
          >
            <Download className="size-4" />
            {hasUploadedPdf ? "Baixar PDF" : "Salvar como PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
