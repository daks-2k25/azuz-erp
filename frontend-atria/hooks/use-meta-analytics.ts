import { useQuery } from "@tanstack/react-query";
import {
  getMetaAgencyOverview,
  getMetaClientInsights,
  getMetaClients,
} from "@/services/meta-analytics.service";
import type { MetaAnalyticsQuery, MetaDatePreset } from "@/services/types";

export function useMetaClients(search?: string) {
  return useQuery({
    queryKey: ["meta-clients", search ?? ""],
    queryFn: () => getMetaClients(search),
    staleTime: 60_000,
  });
}

export function useMetaAnalytics(
  clientId: string | null | undefined,
  datePreset: MetaDatePreset = "last_90d",
  month?: number,
  year?: number,
) {
  return useQuery({
    queryKey: ["meta-analytics", clientId, datePreset, month ?? null, year ?? null],
    queryFn: () =>
      getMetaClientInsights(clientId!, {
        datePreset,
        month,
        year,
      }),
    enabled: Boolean(clientId),
  });
}

export function useMetaAgencyOverview(params: MetaAnalyticsQuery) {
  return useQuery({
    queryKey: [
      "meta-agency",
      params.datePreset ?? "last_90d",
      params.month ?? null,
      params.year ?? null,
      params.search ?? "",
    ],
    queryFn: () => getMetaAgencyOverview(params),
    staleTime: 30_000,
  });
}
