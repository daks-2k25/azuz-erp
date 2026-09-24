import { apiRequest, uploadFile } from "./api";
import type { AppearanceSettings } from "@/lib/theme-utils";
import type { AgencyBranding } from "@/lib/branding-utils";
import type { IntegrationSettings } from "./types";

export async function getBranding() {
  return apiRequest<AgencyBranding>("/settings/branding", {
    skipAuth: true,
    skipToast: true,
  });
}

export async function updateBranding(data: AgencyBranding) {
  return apiRequest<AgencyBranding>("/settings/branding", {
    method: "PATCH",
    body: {
      agencyName: data.agencyName,
      logoUrl: data.logoUrl,
      faviconUrl: data.faviconUrl,
      primaryColor: data.primaryColor,
      accentColor: data.accentColor,
    },
  });
}

export async function uploadBrandingAsset(
  type: "logo" | "favicon",
  file: File,
) {
  const formData = new FormData();
  formData.append("file", file);

  return uploadFile<AgencyBranding>(
    `/settings/branding/upload?type=${type}`,
    formData,
  );
}

export async function getAppearance() {
  return apiRequest<AppearanceSettings>("/settings/appearance");
}

export async function updateAppearance(data: AppearanceSettings) {
  return apiRequest<AppearanceSettings>("/settings/appearance", {
    method: "PATCH",
    body: {
      primaryColor: data.primaryColor,
      accentColor: data.accentColor,
      backgroundColor: data.backgroundColor,
      textColor: data.textColor,
      sidebarColor: data.sidebarColor,
    },
  });
}

export async function getIntegrations() {
  return apiRequest<IntegrationSettings>("/settings/integrations");
}

export async function updateIntegrations(
  data: Partial<IntegrationSettings>,
) {
  return apiRequest<IntegrationSettings>("/settings/integrations", {
    method: "PATCH",
    body: data,
  });
}
