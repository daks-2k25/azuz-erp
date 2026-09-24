import type { User } from "@/services/types";

const ACCESS_TOKEN_KEY = "atria_access_token";
const USER_KEY = "atria_user";
const REMEMBERED_EMAIL_KEY = "atria_remembered_email";

function getPersistentStorage(remember: boolean): Storage {
  return remember ? localStorage : sessionStorage;
}

export function isRememberedSession(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ??
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function setAccessToken(token: string, remember = false): void {
  if (typeof window === "undefined") return;
  clearAccessToken();
  getPersistentStorage(remember).setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored =
    localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User, remember = false): void {
  if (typeof window === "undefined") return;
  clearStoredUser();
  getPersistentStorage(remember).setItem(USER_KEY, JSON.stringify(user));
}

/** Patch the currently stored user in whichever storage holds the session. */
export function patchStoredUser(partial: Partial<User>): User | null {
  if (typeof window === "undefined") return null;
  const inLocal = localStorage.getItem(USER_KEY);
  const inSession = sessionStorage.getItem(USER_KEY);
  const raw = inLocal ?? inSession;
  if (!raw) return null;
  try {
    const current = JSON.parse(raw) as User;
    const next = { ...current, ...partial };
    const storage = inLocal ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function clearAuthStorage(): void {
  clearAccessToken();
  clearStoredUser();
}

export function getRememberedEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REMEMBERED_EMAIL_KEY);
}

export function setRememberedEmail(email: string | null): void {
  if (typeof window === "undefined") return;
  if (email) {
    localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
  } else {
    localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  }
}
