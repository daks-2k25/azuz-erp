import { apiRequest } from "./api";
import type {
  ClientGroup,
  CreateClientGroupInput,
  UpdateClientGroupInput,
} from "./types";

export async function getClientGroups(): Promise<ClientGroup[]> {
  return apiRequest<ClientGroup[]>("/client-groups");
}

export async function createClientGroup(
  data: CreateClientGroupInput,
): Promise<ClientGroup> {
  return apiRequest<ClientGroup>("/client-groups", {
    method: "POST",
    body: data,
  });
}

export async function updateClientGroup(
  id: string,
  data: UpdateClientGroupInput,
): Promise<ClientGroup> {
  return apiRequest<ClientGroup>(`/client-groups/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteClientGroup(id: string): Promise<void> {
  return apiRequest<void>(`/client-groups/${id}`, { method: "DELETE" });
}

export async function bulkImportClientGroups(
  groups: CreateClientGroupInput[],
) {
  return apiRequest<{ created: number; errors: { index: number; message: string }[] }>(
    "/client-groups/bulk",
    { method: "POST", body: { groups } },
  );
}
