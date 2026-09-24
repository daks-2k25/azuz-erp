"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getClientDisplayName, getClientInitials } from "@/lib/calendar-utils";
import { resolveBrandingAssetUrl } from "@/lib/branding-utils";
import { cn } from "@/lib/utils";
import type { CalendarEventClient } from "@/services/types";

interface CalendarClientAvatarProps {
  client: CalendarEventClient | null | undefined;
  fallbackName?: string;
  size?: "xs" | "sm";
  className?: string;
}

export function CalendarClientAvatar({
  client,
  fallbackName = "",
  size = "xs",
  className,
}: CalendarClientAvatarProps) {
  const name = getClientDisplayName(client, fallbackName);
  const avatarSrc = resolveBrandingAssetUrl(client?.avatarUrl ?? null);
  const dimension = size === "xs" ? "size-4" : "size-5";
  const textSize = size === "xs" ? "text-[8px]" : "text-[9px]";

  return (
    <Avatar
      size="sm"
      className={cn(dimension, "ring-1 ring-white/30", className)}
    >
      {avatarSrc ? <AvatarImage src={avatarSrc} alt={name} /> : null}
      <AvatarFallback
        className={cn(textSize, "bg-[#004949] font-bold text-white")}
      >
        {getClientInitials(name || "?")}
      </AvatarFallback>
    </Avatar>
  );
}
