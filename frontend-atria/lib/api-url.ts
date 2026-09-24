const PRODUCTION_API_URL =
  "https://atria-backend-broken-night-9242.fly.dev";
const DEVELOPMENT_API_URL = "http://localhost:3001";

export function resolveApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  return process.env.NODE_ENV === "production"
    ? PRODUCTION_API_URL
    : DEVELOPMENT_API_URL;
}
