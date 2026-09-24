"use client";

import { Lightbulb } from "lucide-react";
import { ClientRequestsWorkspace } from "@/components/clients/client-requests-workspace";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Client } from "@/services/types";

interface ClientRequestsDrawerProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

export function ClientRequestsDrawer({
  client,
  open,
  onOpenChange,
  onUpdated,
}: ClientRequestsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex !w-[min(96vw,88rem)] !max-w-none flex-col gap-0 overflow-hidden p-0"
      >
        <SheetHeader className="border-b border-[var(--atria-primary)]/10 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[var(--atria-accent)]/35 text-[var(--atria-primary)]">
              <Lightbulb className="size-5" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-left text-xl text-[var(--atria-primary)]">
                Solicitações / Ideias
              </SheetTitle>
              <p className="mt-1 text-sm text-[var(--atria-primary)]/55">
                {client.companyName} · pedidos enviados pelo portal do cliente
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-5">
          {open && (
            <ClientRequestsWorkspace
              clientId={client.id}
              onUpdated={onUpdated}
              layout="drawer"
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
