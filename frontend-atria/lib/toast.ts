import { toast as sonnerToast } from "sonner";
import { ApiError } from "@/services/api";

export const toast = sonnerToast;

const SILENT_ENDPOINTS = ["/auth/refresh"];

const SILENT_ERROR_MESSAGE_FRAGMENTS = [
  "usuários client só podem acessar",
];

export function shouldShowApiErrorToast(
  status: number,
  endpoint: string,
  message?: string,
): boolean {
  if (SILENT_ENDPOINTS.some((path) => endpoint.startsWith(path))) {
    return false;
  }

  if (status === 401 && endpoint.startsWith("/auth/refresh")) {
    return false;
  }

  if (
    message &&
    SILENT_ERROR_MESSAGE_FRAGMENTS.some((fragment) =>
      message.toLowerCase().includes(fragment),
    )
  ) {
    return false;
  }

  return status >= 400;
}

export function showApiError(error: ApiError, endpoint?: string) {
  if (endpoint?.startsWith("/auth/login")) {
    toast.error("E-mail ou senha inválidos");
    return;
  }

  toast.error(error.message || "Ocorreu um erro inesperado. Tente novamente.");
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message;
  return fallback;
}
