import { ApiError } from "@/services/api";

export function isCrmDisabledApiError(error: unknown): boolean {
  if (!(error instanceof ApiError)) {
    return false;
  }

  if (error.status !== 403) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("crm desabilitado") ||
    message.includes("crm não está ativado") ||
    message.includes("não está ativado para esta empresa")
  );
}
