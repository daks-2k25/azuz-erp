import { apiRequest } from "./api";
import type {
  ClientReport,
  GenerateReportInput,
  PortalTokenResult,
} from "./types";

export async function getReports(params?: {
  clientId?: string;
  month?: number;
  year?: number;
}) {
  const search = new URLSearchParams();
  if (params?.clientId) search.set("clientId", params.clientId);
  if (params?.month) search.set("month", String(params.month));
  if (params?.year) search.set("year", String(params.year));
  const qs = search.toString();
  return apiRequest<ClientReport[]>(`/reports${qs ? `?${qs}` : ""}`);
}

export async function getReport(id: string) {
  return apiRequest<ClientReport>(`/reports/${id}`);
}

export async function generateReport(
  clientId: string,
  input: GenerateReportInput,
) {
  return apiRequest<ClientReport>(`/reports/generate/${clientId}`, {
    method: "POST",
    body: input,
  });
}

export async function generatePortalToken(clientId: string) {
  return apiRequest<PortalTokenResult>(`/reports/portal-token/${clientId}`, {
    method: "POST",
  });
}
