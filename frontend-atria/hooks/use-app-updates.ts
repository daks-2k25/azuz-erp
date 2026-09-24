import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCompanyId } from "@/hooks/use-company-id";
import { appUpdateKeys } from "@/lib/query-keys";
import { appUpdatesService } from "@/services";
import type {
  CreateAppUpdateInput,
  UpdateAppUpdateInput,
} from "@/services/types";

export function useAppUpdatesAccess() {
  const companyId = useCompanyId();

  return useQuery({
    queryKey: appUpdateKeys.access(companyId ?? ""),
    queryFn: () => appUpdatesService.getAccess(),
    enabled: Boolean(companyId),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useMarkAppUpdatesAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => appUpdatesService.markAppUpdatesAsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: appUpdateKeys.root,
      });
    },
  });
}

export function useMarkAppUpdateAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appUpdatesService.markAppUpdateAsRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: appUpdateKeys.root,
      });
    },
  });
}

export function useAppUpdates(enabled = true) {
  const companyId = useCompanyId();

  return useQuery({
    queryKey: appUpdateKeys.list(companyId ?? ""),
    queryFn: () => appUpdatesService.getAppUpdates(),
    enabled: Boolean(companyId) && enabled,
    staleTime: 30_000,
  });
}

export function useAppUpdateMutations() {
  const queryClient = useQueryClient();
  const companyId = useCompanyId();

  async function invalidate() {
    await queryClient.invalidateQueries({
      queryKey: appUpdateKeys.root,
    });
  }

  const create = useMutation({
    mutationFn: (data: CreateAppUpdateInput) =>
      appUpdatesService.createAppUpdate(data),
    onSuccess: () => invalidate(),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppUpdateInput }) =>
      appUpdatesService.updateAppUpdate(id, data),
    onSuccess: () => invalidate(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => appUpdatesService.deleteAppUpdate(id),
    onSuccess: () => invalidate(),
  });

  return { create, update, remove, companyId };
}
