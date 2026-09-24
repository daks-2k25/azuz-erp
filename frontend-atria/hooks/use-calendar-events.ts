import { useQuery } from "@tanstack/react-query";
import { useCompanyId } from "@/hooks/use-company-id";
import { calendarKeys } from "@/lib/query-keys";
import { calendarService } from "@/services";

export function useCalendarEvents(params?: {
  from?: string;
  to?: string;
  clientId?: string | null;
}) {
  const companyId = useCompanyId();
  const from = params?.from;
  const to = params?.to;
  const clientId = params?.clientId ?? null;

  return useQuery({
    queryKey: calendarKeys.events(companyId ?? "", { from, to, clientId }),
    queryFn: () =>
      calendarService.getEvents({
        from,
        to,
        clientId: clientId ?? undefined,
      }),
    enabled: Boolean(companyId),
    staleTime: 15_000,
  });
}
