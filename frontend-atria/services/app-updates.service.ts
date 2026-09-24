import { apiRequest } from "./api";
import type {
  AppUpdate,
  AppUpdatesAccess,
  CreateAppUpdateInput,
  UpdateAppUpdateInput,
} from "./types";

export async function getAccess(): Promise<AppUpdatesAccess> {
  return apiRequest<AppUpdatesAccess>("/app-updates/access");
}

export async function markAppUpdatesAsRead(): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>("/app-updates/mark-read", {
    method: "POST",
  });
}

export async function markAppUpdateAsRead(
  id: string,
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/app-updates/${id}/mark-read`, {
    method: "POST",
  });
}

export async function getAppUpdates(): Promise<AppUpdate[]> {
  return apiRequest<AppUpdate[]>("/app-updates");
}

export async function createAppUpdate(
  data: CreateAppUpdateInput,
): Promise<AppUpdate> {
  return apiRequest<AppUpdate>("/app-updates", {
    method: "POST",
    body: {
      ...data,
      visibleRoles: data.visibleRoles.map((role) => role.toUpperCase()),
    },
  });
}

export async function updateAppUpdate(
  id: string,
  data: UpdateAppUpdateInput,
): Promise<AppUpdate> {
  return apiRequest<AppUpdate>(`/app-updates/${id}`, {
    method: "PATCH",
    body: {
      ...data,
      ...(data.visibleRoles
        ? { visibleRoles: data.visibleRoles.map((role) => role.toUpperCase()) }
        : {}),
    },
  });
}

export async function deleteAppUpdate(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/app-updates/${id}`, {
    method: "DELETE",
  });
}
