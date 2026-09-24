import { isExternalCrmRole } from "@/lib/roles";

export function isCrmEnabledForUser(
  hasCrmEnabled: boolean | null | undefined,
): boolean {
  return hasCrmEnabled === true;
}

export function shouldBlockCrmRoutes(
  role: string | null | undefined,
  hasCrmEnabled: boolean | null | undefined,
): boolean {
  return isExternalCrmRole(role) && !isCrmEnabledForUser(hasCrmEnabled);
}

export function canAccessClientPortal(
  role: string | null | undefined,
  hasCrmEnabled: boolean | null | undefined,
): boolean {
  const normalized = (role ?? "").trim().toLowerCase();
  if (normalized === "client") return true;
  if (isExternalCrmRole(role) && !isCrmEnabledForUser(hasCrmEnabled)) {
    return true;
  }
  return false;
}
