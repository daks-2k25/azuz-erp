import { apiRequest } from "./api";

export interface SlaSettings {
  slaResponseCriticalHours: number;
  slaResponseHighHours: number;
  slaResponseMediumHours: number;
  slaResponseLowHours: number;
  slaResponsePlannedHours: number;
  slaResolutionCriticalHours: number;
  slaResolutionHighHours: number;
  slaResolutionMediumHours: number;
  slaResolutionLowHours: number;
  slaResolutionPlannedHours: number;
}

export type SlaUiStatus =
  | "not_tracked"
  | "ok"
  | "approaching_response"
  | "response_breached"
  | "approaching_resolution"
  | "resolution_breached"
  | "met";

export interface SlaDashboardItem {
  id: string;
  type: "task" | "brief";
  title: string;
  clientName: string | null;
  priority: string;
  slaStatus: SlaUiStatus;
  slaResponseDueAt: string | null;
  slaResolutionDueAt: string | null;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  createdAt: string;
  status?: string;
  assignee?: { id: string; name: string; avatarUrl: string | null } | null;
}

export interface SlaDashboard {
  summary: {
    openTasks: number;
    openBriefs: number;
    breachedCount: number;
    atRiskCount: number;
  };
  breached: SlaDashboardItem[];
  atRisk: SlaDashboardItem[];
  tasks: SlaDashboardItem[];
  briefs: SlaDashboardItem[];
}

export async function getSlaSettings(): Promise<SlaSettings> {
  return apiRequest<SlaSettings>("/sla/settings");
}

export async function updateSlaSettings(data: Partial<SlaSettings>) {
  return apiRequest<SlaSettings>("/sla/settings", {
    method: "PATCH",
    body: data,
  });
}

export async function getSlaDashboard(): Promise<SlaDashboard> {
  return apiRequest<SlaDashboard>("/sla/dashboard");
}

export async function updateBriefSla(
  id: string,
  data: {
    status?: "open" | "in_progress" | "resolved" | "closed";
    priority?: "critical" | "high" | "medium" | "low" | "planned";
    assignedToId?: string | null;
  },
) {
  const body: Record<string, string | null> = {};
  if (data.status) body.status = data.status.toUpperCase();
  if (data.priority) body.priority = data.priority.toUpperCase();
  if (data.assignedToId !== undefined) body.assignedToId = data.assignedToId;

  return apiRequest(`/sla/briefs/${id}`, {
    method: "PATCH",
    body,
  });
}
