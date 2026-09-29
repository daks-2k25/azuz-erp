import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCompanyId } from "@/hooks/use-company-id";
import { timeTrackingKeys } from "@/lib/query-keys";
import { timeTrackingService } from "@/services";
import type { TodayClock } from "@/services/time-tracking.service";

/** Atualiza as horas trabalhadas na tela sem o usuário recarregar. */
const TODAY_REFRESH_INTERVAL_MS = 60_000;

export interface TodayClockView extends TodayClock {
  /** Diferença entre o relógio do servidor e o do aparelho, em ms. */
  serverOffsetMs: number;
}

function withServerOffset(today: TodayClock): TodayClockView {
  return {
    ...today,
    serverOffsetMs: Date.parse(today.serverTime) - Date.now(),
  };
}

/** Cadastro CLT do usuário logado (null quando ele não bate ponto). */
export function useMyEmployeeProfile() {
  const companyId = useCompanyId();

  return useQuery({
    queryKey: timeTrackingKeys.myProfile(companyId ?? ""),
    queryFn: async () =>
      (await timeTrackingService.getMyEmployeeProfile()).profile,
    enabled: Boolean(companyId),
    staleTime: 5 * 60_000,
  });
}

export function useHasActiveClockProfile(): boolean {
  const { data: profile } = useMyEmployeeProfile();
  return Boolean(profile?.isActive);
}

export function useTodayClock(enabled: boolean) {
  const companyId = useCompanyId();

  return useQuery({
    queryKey: timeTrackingKeys.todayClock(companyId ?? ""),
    queryFn: async () =>
      withServerOffset(await timeTrackingService.getTodayClock()),
    enabled: Boolean(companyId) && enabled,
    refetchInterval: TODAY_REFRESH_INTERVAL_MS,
  });
}

export function useRegisterClockEntry() {
  const queryClient = useQueryClient();
  const companyId = useCompanyId();

  return useMutation({
    mutationFn: () => timeTrackingService.registerClockEntry(),
    onSuccess: (result) => {
      queryClient.setQueryData(
        timeTrackingKeys.todayClock(companyId ?? ""),
        withServerOffset(result.today),
      );
    },
  });
}
