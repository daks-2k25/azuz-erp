import { apiRequest } from "./api";
import type {
  CreateSuggestionInput,
  SystemSuggestion,
  UpdateSuggestionStatusInput,
} from "./types";

export async function createSuggestion(
  data: CreateSuggestionInput,
): Promise<SystemSuggestion> {
  return apiRequest<SystemSuggestion>("/suggestions", {
    method: "POST",
    body: data,
  });
}

export async function getMySuggestions(): Promise<SystemSuggestion[]> {
  return apiRequest<SystemSuggestion[]>("/suggestions/mine");
}

export async function getAllSuggestions(): Promise<SystemSuggestion[]> {
  return apiRequest<SystemSuggestion[]>("/suggestions");
}

export async function updateSuggestionStatus(
  id: string,
  data: UpdateSuggestionStatusInput,
): Promise<SystemSuggestion> {
  return apiRequest<SystemSuggestion>(`/suggestions/${id}/status`, {
    method: "PATCH",
    body: data,
  });
}
