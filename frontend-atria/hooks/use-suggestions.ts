import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCompanyId } from "@/hooks/use-company-id";
import { suggestionKeys } from "@/lib/query-keys";
import { suggestionsService } from "@/services";
import type {
  CreateSuggestionInput,
  SystemSuggestionStatus,
} from "@/services/types";

export function useMySuggestions() {
  const companyId = useCompanyId();

  return useQuery({
    queryKey: suggestionKeys.mine(companyId ?? ""),
    queryFn: () => suggestionsService.getMySuggestions(),
    enabled: Boolean(companyId),
    staleTime: 30_000,
  });
}

export function useAllSuggestions(enabled = true) {
  const companyId = useCompanyId();

  return useQuery({
    queryKey: suggestionKeys.all(companyId ?? ""),
    queryFn: () => suggestionsService.getAllSuggestions(),
    enabled: Boolean(companyId) && enabled,
    staleTime: 30_000,
  });
}

export function useSuggestionMutations() {
  const queryClient = useQueryClient();
  const companyId = useCompanyId();

  async function invalidate() {
    await queryClient.invalidateQueries({
      queryKey: suggestionKeys.root,
    });
  }

  const create = useMutation({
    mutationFn: (data: CreateSuggestionInput) =>
      suggestionsService.createSuggestion(data),
    onSuccess: () => invalidate(),
  });

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: SystemSuggestionStatus;
    }) => suggestionsService.updateSuggestionStatus(id, { status }),
    onSuccess: () => invalidate(),
  });

  return { create, updateStatus };
}
