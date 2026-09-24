import { API_BASE_URL } from "@/services/api";

export interface AgencyBranding {
  agencyName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  accentColor: string;
  updatedAt?: string;
}

export const DEFAULT_BRANDING: AgencyBranding = {
  agencyName: "ATRIA ERP",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#004949",
  accentColor: "#E8C39E",
};

export function resolveBrandingAssetUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

export function applyBrandingToDocument(branding: AgencyBranding) {
  const faviconHref = resolveBrandingAssetUrl(branding.faviconUrl);
  let link = document.querySelector<HTMLLinkElement>("link[data-branding-favicon]");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.setAttribute("data-branding-favicon", "true");
    document.head.appendChild(link);
  }

  if (faviconHref) {
    link.href = faviconHref;
  } else {
    link.href = "/favicon.ico";
  }
}
