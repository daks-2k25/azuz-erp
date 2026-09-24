import { apiRequest } from "./api";
import type { TenantCompany } from "./types";

export async function getPrimaryCompany(): Promise<TenantCompany> {
  return apiRequest<TenantCompany>("/public/company", {
    skipAuth: true,
    skipToast: true,
  });
}

export async function getCompanies(): Promise<TenantCompany[]> {
  return apiRequest<TenantCompany[]>("/companies");
}

export async function getCompany(id: string): Promise<TenantCompany> {
  return apiRequest<TenantCompany>(`/companies/${id}`);
}
