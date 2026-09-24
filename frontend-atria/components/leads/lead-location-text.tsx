"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Lead } from "@/services/types";

function buildLocationLabel(lead: Pick<Lead, "neighborhood" | "city">) {
  return [lead.neighborhood, lead.city].filter(Boolean).join(", ");
}

function buildFullLocation(
  lead: Pick<Lead, "address" | "neighborhood" | "city">,
) {
  return [lead.address, lead.neighborhood, lead.city]
    .filter(Boolean)
    .join(" · ");
}

interface LeadLocationTextProps {
  lead: Pick<Lead, "address" | "neighborhood" | "city">;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  showAddress?: boolean;
  emptyLabel?: string;
}

export function LeadLocationText({
  lead,
  className,
  primaryClassName,
  secondaryClassName,
  showAddress = true,
  emptyLabel = "—",
}: LeadLocationTextProps) {
  const locationLabel = buildLocationLabel(lead);
  const fullLocation = buildFullLocation(lead);
  const hasLocation = Boolean(locationLabel || lead.address);

  if (!hasLocation) {
    return (
      <span className={cn("text-[var(--atria-primary)]/45", className)}>
        {emptyLabel}
      </span>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <div
              className={cn(
                "min-w-0 max-w-full cursor-default text-left",
                className,
              )}
            />
          }
        >
          {locationLabel ? (
            <p
              className={cn(
                "min-w-0 truncate text-sm text-[var(--atria-primary)]/70",
                primaryClassName,
              )}
            >
              {locationLabel}
            </p>
          ) : null}
          {showAddress && lead.address ? (
            <p
              className={cn(
                "mt-0.5 min-w-0 line-clamp-2 break-words text-xs text-[var(--atria-primary)]/45",
                secondaryClassName,
              )}
            >
              {lead.address}
            </p>
          ) : null}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs break-words text-left">
          {fullLocation || locationLabel}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
