import { useQuery } from "@tanstack/react-query";
import { useCompanyId } from "@/hooks/use-company-id";
import { tvMonitoringKeys } from "@/lib/query-keys";
import { dashboardService } from "@/services";

const TV_POLL_INTERVAL_MS = 30_000;

export function useTvMonitoring() {
  const companyId = useCompanyId();

  return useQuery({
    queryKey: tvMonitoringKeys.all(companyId ?? ""),
    queryFn: () => dashboardService.getTvMonitoring(),
    enabled: Boolean(companyId),
    staleTime: TV_POLL_INTERVAL_MS,
    refetchInterval: TV_POLL_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });
}
