"use client";

import { PdfViewer } from "@/components/pdf/pdf-viewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDate,
  FREQUENCY_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/lib/contract-utils";
import type { Contract } from "@/services/types";

interface ContractPreviewDialogProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractPreviewDialog({
  contract,
  open,
  onOpenChange,
}: ContractPreviewDialogProps) {
  if (!contract) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-[var(--atria-primary)]">
            Prévia do Contrato
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={STATUS_STYLES[contract.status]}>
              {STATUS_LABELS[contract.status]}
            </Badge>
            <span className="text-sm text-[var(--atria-primary)]/60">
              {contract.client.companyName}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
              {contract.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--atria-primary)]/60">
              {formatCurrency(contract.recurringValue)} ·{" "}
              {FREQUENCY_LABELS[contract.paymentFrequency]} · Início:{" "}
              {formatDate(contract.startDate)}
              {contract.endDate && ` · Término: ${formatDate(contract.endDate)}`}
            </p>
          </div>

          {contract.pdfUrl ? (
            <div className="overflow-hidden rounded-xl border border-[var(--atria-primary)]/10">
              <PdfViewer
                url={contract.pdfUrl}
                fileName={contract.title}
                className="h-[60vh]"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--atria-primary)]/10 bg-white p-6 shadow-inner">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--atria-primary)]/80">
                {contract.termsContent}
              </pre>
            </div>
          )}

          {contract.receivablesCount > 0 && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {contract.receivablesCount} recebível(is) gerado(s) no financeiro.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
