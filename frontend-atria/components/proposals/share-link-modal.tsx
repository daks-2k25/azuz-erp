"use client";

import { Check, Copy, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";

interface ShareLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publicUrl: string;
}

export function ShareLinkModal({
  open,
  onOpenChange,
  publicUrl,
}: ShareLinkModalProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link copiado");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Proposta publicada</DialogTitle>
          <DialogDescription>
            Compartilhe o link público com o cliente. Não é necessário login.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input readOnly value={publicUrl} className="font-mono text-xs" />
            <Button type="button" variant="outline" onClick={() => void handleCopy()}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="size-4" />
              Fechar
            </Button>
            <Button
              type="button"
              render={<a href={publicUrl} target="_blank" rel="noreferrer" />}
            >
              <ExternalLink className="size-4" />
              Abrir proposta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
