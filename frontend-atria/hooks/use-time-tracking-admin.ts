import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCompanyId } from "@/hooks/use-company-id";
import { timeTrackingKeys } from "@/lib/query-keys";
import { timeTrackingService } from "@/services";
import type {
  CreateEmployeeProfileInput,
  UpdateEmployeeProfileInput,
  WorkScheduleInput,
} from "@/services/time-tracking.service";

export function useWorkSchedules() {
  const companyId = useCompanyId();

  return useQuery({
    queryKey: timeTrackingKeys.workSchedules(companyId ?? ""),
    queryFn: () => timeTrackingService.getWorkSchedules(),
    enabled: Boolean(companyId),
  });
}

export function useEmployeeProfiles() {
  const companyId = useCompanyId();

  return useQuery({
    queryKey: timeTrackingKeys.employees(companyId ?? ""),
    queryFn: () => timeTrackingService.getEmployeeProfiles(),
    enabled: Boolean(companyId),
  });
}

export function useWorkScheduleMutations() {
  const invalidate = useInvalidateTimeTracking();

  const create = useMutation({
    mutationFn: (data: WorkScheduleInput) =>
      timeTrackingService.createWorkSchedule(data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: WorkScheduleInput }) =>
      timeTrackingService.updateWorkSchedule(id, data),
    onSuccess: invalidate,
  });

  const setActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      timeTrackingService.setWorkScheduleActive(id, isActive),
    onSuccess: invalidate,
  });

  return { create, update, setActive };
}

export function useEmployeeProfileMutations() {
  const invalidate = useInvalidateTimeTracking();

  const create = useMutation({
    mutationFn: (data: CreateEmployeeProfileInput) =>
      timeTrackingService.createEmployeeProfile(data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEmployeeProfileInput;
    }) => timeTrackingService.updateEmployeeProfile(id, data),
    onSuccess: invalidate,
  });

  const setActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      timeTrackingService.setEmployeeProfileActive(id, isActive),
    onSuccess: invalidate,
  });

  return { create, update, setActive };
}

function useInvalidateTimeTracking() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: timeTrackingKeys.root });
  };
}
