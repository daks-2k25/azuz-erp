import { apiRequest } from "./api";
import type {
  ClientInsights,
  MetaCampaign,
  MetaInsightsOverview,
  MetaPerformancePoint,
} from "./types";

export async function getOverview(): Promise<MetaInsightsOverview> {
  return apiRequest<MetaInsightsOverview>("/insights/overview");
}

export async function getPerformance(): Promise<MetaPerformancePoint[]> {
  return apiRequest<MetaPerformancePoint[]>("/insights/performance");
}

export async function getCampaigns(): Promise<MetaCampaign[]> {
  return apiRequest<MetaCampaign[]>("/insights/campaigns");
}

export async function getClientInsights(
  clientId: string,
): Promise<ClientInsights> {
  return apiRequest<ClientInsights>(`/insights/client/${clientId}`);
}

export async function updateCampaignStatus(
  id: string,
  status: "active" | "paused",
): Promise<MetaCampaign> {
  return apiRequest<MetaCampaign>(`/insights/campaigns/${id}`, {
    method: "PATCH",
    body: { status },
  });
}
