"use client";

import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPortalSdrLeadsBannerMessage } from "@/lib/portal-crm-notifications";

interface PortalCrmSdrLeadsBannerProps {
  count: number;
  onDismiss: () => void;
}

export function PortalCrmSdrLeadsBanner({
  count,
  onDismiss,
}: PortalCrmSdrLeadsBannerProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[var(--atria-accent)]/35 bg-[var(--atria-accent)]/12 px-4 py-3 text-sm text-[var(--atria-primary)]">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-[var(--atria-primary)]/70" />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-[var(--atria-primary)]">
          Novos leads no funil
        </p>
        <p className="mt-0.5 text-[var(--atria-primary)]/65">
          {formatPortalSdrLeadsBannerMessage(count)}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-[var(--atria-primary)]/50 hover:text-[var(--atria-primary)]"
        onClick={onDismiss}
        aria-label="Dispensar aviso"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
