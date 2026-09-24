"use client";

import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import type { PermissionKey } from "@/lib/permissions";

interface PermissionGateProps {
  anyOf?: PermissionKey[];
  allOf?: PermissionKey[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({
  anyOf,
  allOf,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission } = usePermissions();

  if (allOf?.length && !allOf.every((permission) => hasPermission(permission))) {
    return <>{fallback}</>;
  }

  if (anyOf?.length && !hasAnyPermission(anyOf)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
