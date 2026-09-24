import { apiRequest } from "./api";
import type {
  CalendarEntry,
  CreateCalendarEntryInput,
  UpdateCalendarEntryInput,
} from "./types";

function buildQuery(params?: {
  year?: number;
  month?: number;
  clientId?: string;
}): string {
  const entries = Object.entries(params ?? {})
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => [k, String(v)]);
  const query = new URLSearchParams(entries).toString();
  return query ? `?${query}` : "";
}

export async function getCalendarEntries(params?: {
  year?: number;
  month?: number;
  clientId?: string;
}): Promise<CalendarEntry[]> {
  return apiRequest<CalendarEntry[]>(
    `/calendar-entries${buildQuery(params)}`,
  );
}

export async function getCalendarEntry(id: string): Promise<CalendarEntry> {
  return apiRequest<CalendarEntry>(`/calendar-entries/${id}`);
}

export async function createCalendarEntry(
  data: CreateCalendarEntryInput,
): Promise<CalendarEntry> {
  return apiRequest<CalendarEntry>("/calendar-entries", {
    method: "POST",
    body: data,
  });
}

export async function updateCalendarEntry(
  id: string,
  data: UpdateCalendarEntryInput,
): Promise<CalendarEntry> {
  return apiRequest<CalendarEntry>(`/calendar-entries/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteCalendarEntry(id: string): Promise<void> {
  return apiRequest<void>(`/calendar-entries/${id}`, { method: "DELETE" });
}
