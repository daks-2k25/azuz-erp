const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type CookieSameSite = boolean | "lax" | "strict" | "none";

type CookieOptions = {
  path?: string;
  sameSite?: CookieSameSite;
  secure?: boolean;
  maxAge?: number;
  domain?: string;
  httpOnly?: boolean;
};

function normalizeSameSite(
  value: CookieSameSite | undefined,
): "lax" | "strict" | "none" {
  if (value === true || value === "strict") return "strict";
  if (value === "none") return "none";
  return "lax";
}

export function getSupabaseCookieOptions(
  overrides: CookieOptions = {},
): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  const domain = process.env.AUTH_COOKIE_DOMAIN?.trim() || undefined;

  return {
    path: "/",
    secure: isProduction,
    maxAge: SESSION_MAX_AGE_SECONDS,
    ...(domain ? { domain } : {}),
    ...overrides,
    sameSite: normalizeSameSite(overrides.sameSite ?? "lax"),
  };
}
