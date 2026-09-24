import { apiRequest } from "./api";
import type { DashboardOverview, TvMonitoringOverview } from "./types";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return apiRequest<DashboardOverview>("/dashboard/overview");
}

export async function getTvMonitoring(): Promise<TvMonitoringOverview> {
  return apiRequest<TvMonitoringOverview>("/dashboard/tv-monitoring");
}
