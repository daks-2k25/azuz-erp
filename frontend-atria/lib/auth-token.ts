export const ACCESS_TOKEN_REFRESH_BUFFER_MS = 2 * 60 * 1000;
export const PROACTIVE_REFRESH_INTERVAL_MS = 30 * 1000;

export function parseAccessTokenExpiry(token: string | null): number | null {
  if (!token) return null;
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const json = atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(token: string | null): boolean {
  const expiresAt = parseAccessTokenExpiry(token);
  if (expiresAt == null) return true;
  return expiresAt <= Date.now();
}

export function accessTokenNeedsRefresh(token: string | null): boolean {
  const expiresAt = parseAccessTokenExpiry(token);
  if (expiresAt == null) return true;
  return expiresAt <= Date.now() + ACCESS_TOKEN_REFRESH_BUFFER_MS;
}
