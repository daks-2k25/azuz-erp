import { useQuery } from "@tanstack/react-query";
import { useCompanyId } from "@/hooks/use-company-id";
import { taskKeys } from "@/lib/query-keys";
import { kanbanService } from "@/services";

export function useTasks() {
  const companyId = useCompanyId();

  return useQuery({
    queryKey: taskKeys.all(companyId ?? ""),
    queryFn: () => kanbanService.getTasks(),
    enabled: Boolean(companyId),
    staleTime: 10_000,
    refetchInterval: 8_000,
    refetchOnWindowFocus: true,
  });
}
