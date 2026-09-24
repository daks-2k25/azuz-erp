"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";

interface RejectClientRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestTitle?: string;
  submitting?: boolean;
  onSubmit: (reason: string) => Promise<void>;
}

export function RejectClientRequestDialog({
  open,
  onOpenChange,
  requestTitle,
  submitting = false,
  onSubmit,
}: RejectClientRequestDialogProps) {
  const [reason, setReason] = useState("");

  async function handleSubmit() {
    if (!reason.trim()) return;
    await onSubmit(reason.trim());
    setReason("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) setReason("");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recusar solicitação</DialogTitle>
        </DialogHeader>
        {requestTitle && (
          <p className="text-sm text-[var(--atria-primary)]/60">{requestTitle}</p>
        )}
        <Field>
          <FieldLabel htmlFor="reject-request-reason">
            Motivo da recusa *
          </FieldLabel>
          <textarea
            id="reject-request-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={4}
            placeholder="Explique ao cliente por que a solicitação não será atendida..."
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          />
        </Field>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={submitting || !reason.trim()}
            onClick={() => void handleSubmit()}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Recusar solicitação"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
