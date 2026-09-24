import { apiRequest } from "./api";
import type {
  ClientReportFile,
  CreateClientReportFileInput,
  UpdateClientReportFileInput,
} from "./types";

export async function getClientReportFiles(): Promise<ClientReportFile[]> {
  return apiRequest<ClientReportFile[]>("/client-report-files");
}

export async function getClientReportFile(
  id: string,
): Promise<ClientReportFile> {
  return apiRequest<ClientReportFile>(`/client-report-files/${id}`);
}

export async function createClientReportFile(
  data: CreateClientReportFileInput,
): Promise<ClientReportFile> {
  return apiRequest<ClientReportFile>("/client-report-files", {
    method: "POST",
    body: data,
  });
}

export async function updateClientReportFile(
  id: string,
  data: UpdateClientReportFileInput,
): Promise<ClientReportFile> {
  return apiRequest<ClientReportFile>(`/client-report-files/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteClientReportFile(id: string): Promise<void> {
  return apiRequest<void>(`/client-report-files/${id}`, { method: "DELETE" });
}

export async function approveClientReportFile(
  id: string,
): Promise<ClientReportFile> {
  return apiRequest<ClientReportFile>(`/client-report-files/${id}/approve`, {
    method: "POST",
  });
}
