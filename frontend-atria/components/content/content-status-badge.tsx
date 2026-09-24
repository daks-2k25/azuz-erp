"use client";

import type { ContentPostStatus } from "@/services/types";
import {
  CONTENT_STATUS_LABELS,
  CONTENT_STATUS_STYLES,
} from "@/lib/content-utils";
import { cn } from "@/lib/utils";

interface ContentStatusBadgeProps {
  status: ContentPostStatus;
  className?: string;
}

export function ContentStatusBadge({ status, className }: ContentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        CONTENT_STATUS_STYLES[status],
        className,
      )}
    >
      {CONTENT_STATUS_LABELS[status]}
    </span>
  );
}
