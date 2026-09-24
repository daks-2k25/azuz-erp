export const REFRESH_TOKEN_COOKIE = "atria_refresh_token";

const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function getRefreshTokenCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  const domain = process.env.AUTH_COOKIE_DOMAIN?.trim() || undefined;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: REFRESH_MAX_AGE_SECONDS,
    ...(domain ? { domain } : {}),
  };
}
