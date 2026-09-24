"use client";

import { ExternalLink } from "lucide-react";
import {
  detectLinkProvider,
  LINK_PROVIDER_COLORS,
  LINK_PROVIDER_LABELS,
} from "@/lib/link-utils";
import { cn } from "@/lib/utils";

interface ExternalLinkChipProps {
  url: string;
  className?: string;
  showIcon?: boolean;
}

export function ExternalLinkChip({
  url,
  className,
  showIcon = true,
}: ExternalLinkChipProps) {
  const provider = detectLinkProvider(url);
  const label = LINK_PROVIDER_LABELS[provider];
  const color = LINK_PROVIDER_COLORS[provider];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80",
        className,
      )}
      style={{
        borderColor: `${color}40`,
        backgroundColor: `${color}12`,
        color,
      }}
    >
      {showIcon && <ExternalLink className="size-3.5 shrink-0" />}
      <span className="max-w-[200px] truncate">{label}</span>
    </a>
  );
}
