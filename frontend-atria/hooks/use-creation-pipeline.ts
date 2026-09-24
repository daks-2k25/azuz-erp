import { useQuery } from "@tanstack/react-query";
import { useCompanyId } from "@/hooks/use-company-id";
import { creationKeys } from "@/lib/query-keys";
import { creationService } from "@/services";

export function useCreationPipeline(
  clientId: string | null | undefined,
  params?: { from?: string; to?: string },
) {
  const companyId = useCompanyId();
  const from = params?.from;
  const to = params?.to;

  return useQuery({
    queryKey: creationKeys.pipeline(
      companyId ?? "",
      clientId ?? "",
      from,
      to,
    ),
    queryFn: () =>
      creationService.getClientPipeline(clientId!, {
        from,
        to,
      }),
    enabled: Boolean(companyId && clientId),
    staleTime: 15_000,
  });
}
