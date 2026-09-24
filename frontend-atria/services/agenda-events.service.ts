import { apiRequest } from "./api";
import type {
  AgendaConfirmation,
  AgendaEvent,
  CreateAgendaEventInput,
  UpdateAgendaEventInput,
} from "./types";

export async function getAgendaEvents(): Promise<AgendaEvent[]> {
  return apiRequest<AgendaEvent[]>("/agenda-events");
}

export async function getAgendaEvent(id: string): Promise<AgendaEvent> {
  return apiRequest<AgendaEvent>(`/agenda-events/${id}`);
}

export async function createAgendaEvent(
  data: CreateAgendaEventInput,
): Promise<AgendaEvent> {
  return apiRequest<AgendaEvent>("/agenda-events", {
    method: "POST",
    body: data,
  });
}

export async function updateAgendaEvent(
  id: string,
  data: UpdateAgendaEventInput,
): Promise<AgendaEvent> {
  return apiRequest<AgendaEvent>(`/agenda-events/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteAgendaEvent(id: string): Promise<void> {
  return apiRequest<void>(`/agenda-events/${id}`, { method: "DELETE" });
}

export async function confirmAgendaEvent(
  id: string,
): Promise<AgendaConfirmation> {
  return apiRequest<AgendaConfirmation>(`/agenda-events/${id}/confirm`, {
    method: "POST",
  });
}

export async function confirmAgendaEventForUser(
  id: string,
  userId: string,
): Promise<AgendaConfirmation> {
  return apiRequest<AgendaConfirmation>(
    `/agenda-events/${id}/confirm/${userId}`,
    { method: "POST" },
  );
}
