import { apiRequest } from "./api";
import type { CompanyIntegrations, CompanySettings } from "./types";

export async function getCompanySettings() {
  return apiRequest<CompanySettings>("/api/company/settings");
}

export async function updateCompanySettings(data: Partial<CompanySettings>) {
  return apiRequest<CompanySettings>("/api/company/settings", {
    method: "PATCH",
    body: data,
  });
}

export async function getCompanyIntegrations() {
  return apiRequest<CompanyIntegrations>("/api/company/integrations");
}

export async function updateCompanyIntegrations(
  data: Partial<CompanyIntegrations>,
) {
  return apiRequest<CompanyIntegrations>("/api/company/integrations", {
    method: "PATCH",
    body: data,
  });
}
