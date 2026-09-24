const PORTAL_ACCESS_KEY = "atria_portal_access_token";
const PORTAL_REFRESH_KEY = "atria_portal_refresh_token";
const PORTAL_CLIENT_KEY = "atria_portal_client";

export interface PortalClientSession {
  id: string;
  companyName: string;
}

export function getPortalAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(PORTAL_ACCESS_KEY) ??
    sessionStorage.getItem(PORTAL_ACCESS_KEY)
  );
}

export function setPortalTokens(
  accessToken: string,
  refreshToken: string,
  remember = true,
) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(PORTAL_ACCESS_KEY, accessToken);
  storage.setItem(PORTAL_REFRESH_KEY, refreshToken);
}

export function getPortalRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(PORTAL_REFRESH_KEY) ??
    sessionStorage.getItem(PORTAL_REFRESH_KEY)
  );
}

export function setPortalClient(client: PortalClientSession, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(PORTAL_CLIENT_KEY, JSON.stringify(client));
}

export function getPortalClient(): PortalClientSession | null {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem(PORTAL_CLIENT_KEY) ??
    sessionStorage.getItem(PORTAL_CLIENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PortalClientSession;
  } catch {
    return null;
  }
}

export function clearPortalAuthStorage() {
  localStorage.removeItem(PORTAL_ACCESS_KEY);
  localStorage.removeItem(PORTAL_REFRESH_KEY);
  localStorage.removeItem(PORTAL_CLIENT_KEY);
  sessionStorage.removeItem(PORTAL_ACCESS_KEY);
  sessionStorage.removeItem(PORTAL_REFRESH_KEY);
  sessionStorage.removeItem(PORTAL_CLIENT_KEY);
}
