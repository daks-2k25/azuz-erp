import type { LeadKanbanColumn } from "@/services/types";
import { isSdrZoneStatus } from "@/lib/lead-pipeline-zones";

const PORTAL_CRM_LAST_SEEN_PREFIX = "atria-portal-crm-last-seen";

export function getPortalCrmLastSeenStorageKey(userId?: string | null) {
  return `${PORTAL_CRM_LAST_SEEN_PREFIX}:${userId ?? "anonymous"}`;
}

export function getPortalCrmLastSeenAt(userId?: string | null): number {
  if (typeof window === "undefined") {
    return Date.now();
  }

  const key = getPortalCrmLastSeenStorageKey(userId);
  const raw = window.localStorage.getItem(key);

  if (raw) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  const now = Date.now();
  window.localStorage.setItem(key, String(now));
  return now;
}

export function markPortalCrmSeenNow(userId?: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getPortalCrmLastSeenStorageKey(userId),
    String(Date.now()),
  );
}

export function countNewPortalSdrLeads(
  columns: LeadKanbanColumn[],
  lastSeenAt: number,
): number {
  return columns
    .filter((column) => isSdrZoneStatus(column.status))
    .flatMap((column) => column.leads)
    .filter((lead) => new Date(lead.createdAt).getTime() > lastSeenAt).length;
}

export function formatPortalSdrLeadsBannerMessage(count: number) {
  if (count === 1) {
    return "1 novo lead foi adicionado ao funil pelo time SDR.";
  }

  return `${count} novos leads foram adicionados ao funil pelo time SDR.`;
}
