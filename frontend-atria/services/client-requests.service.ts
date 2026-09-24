import { apiRequest } from "./api";
import type {
  ClientRequest,
  ConvertClientRequestToTaskInput,
  ConvertClientRequestToTaskResult,
  CreateClientRequestInput,
  PortalRequestComment,
  PortalRequestContentType,
  PortalRequestStatus,
  UpdateClientRequestInput,
} from "./types";

function buildQuery(params?: {
  clientId?: string;
  status?: string;
  contentType?: string;
}): string {
  const entries = Object.entries(params ?? {})
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => [key, String(value)]);
  const query = new URLSearchParams(entries).toString();
  return query ? `?${query}` : "";
}

export async function getClientRequests(params?: {
  clientId?: string;
  status?: PortalRequestStatus | string;
  contentType?: PortalRequestContentType | string;
}): Promise<ClientRequest[]> {
  return apiRequest<ClientRequest[]>(
    `/client-requests${buildQuery(params)}`,
  );
}

export async function getClientRequestsForClient(
  clientId: string,
  params?: {
    status?: PortalRequestStatus | string;
    contentType?: PortalRequestContentType | string;
  },
): Promise<ClientRequest[]> {
  return apiRequest<ClientRequest[]>(
    `/clients/${clientId}/requests${buildQuery(params)}`,
  );
}

export async function getClientRequest(id: string): Promise<ClientRequest> {
  return apiRequest<ClientRequest>(`/client-requests/${id}`);
}

export async function createClientRequest(
  data: CreateClientRequestInput,
): Promise<ClientRequest> {
  return apiRequest<ClientRequest>("/client-requests", {
    method: "POST",
    body: data,
  });
}

export async function updateClientRequest(
  id: string,
  data: UpdateClientRequestInput,
): Promise<ClientRequest> {
  return apiRequest<ClientRequest>(`/client-requests/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteClientRequest(id: string): Promise<void> {
  return apiRequest<void>(`/client-requests/${id}`, { method: "DELETE" });
}

export async function addClientRequestComment(
  requestId: string,
  body: string,
  parentId?: string,
): Promise<PortalRequestComment> {
  return apiRequest<PortalRequestComment>(
    `/client-requests/${requestId}/comments`,
    {
      method: "POST",
      body: { body, parentId },
    },
  );
}

export async function convertClientRequestToTask(
  requestId: string,
  data: ConvertClientRequestToTaskInput,
): Promise<ConvertClientRequestToTaskResult> {
  return apiRequest<ConvertClientRequestToTaskResult>(
    `/client-requests/${requestId}/convert-to-task`,
    {
      method: "POST",
      body: data,
    },
  );
}

export async function rejectClientRequest(
  requestId: string,
  rejectionReason: string,
): Promise<ClientRequest> {
  return apiRequest<ClientRequest>(
    `/client-portal/requests/${requestId}/reject`,
    {
      method: "PATCH",
      body: { rejectionReason },
    },
  );
}
