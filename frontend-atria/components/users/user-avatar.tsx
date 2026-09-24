"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getInitials, resolveMediaUrl } from "@/lib/media-url";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
  size?: "default" | "sm" | "lg";
}

export function UserAvatar({
  name,
  avatarUrl,
  className,
  fallbackClassName,
  size = "default",
}: UserAvatarProps) {
  const src = resolveMediaUrl(avatarUrl);

  return (
    <Avatar size={size} className={className}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback className={fallbackClassName}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
