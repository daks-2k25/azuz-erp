import { apiRequest } from "./api";
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  setAccessToken,
  setStoredUser,
} from "@/lib/auth-storage";
import type { AuthResponse, LoginCredentials, User } from "./types";

export interface SignupWithTokenInput {
  token: string;
  name: string;
  email: string;
  password: string;
}

export interface InvitationValidation {
  valid: boolean;
  role: string;
  companyId: string;
  companyName: string;
  expiresAt: string;
}

export async function validateInvitationToken(
  token: string,
): Promise<InvitationValidation> {
  const params = new URLSearchParams({ token });
  return apiRequest<InvitationValidation>(
    `/auth/invitation-tokens/validate?${params.toString()}`,
    { skipAuth: true },
  );
}

export async function signupWithToken(
  input: SignupWithTokenInput,
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>("/auth/signup-with-token", {
    method: "POST",
    body: input,
    skipAuth: true,
  });

  return response;
}

export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: credentials,
    skipAuth: true,
  });

  setAccessToken(response.accessToken);
  setStoredUser(response.user);

  return response;
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>("/auth/logout", { method: "POST" });
  } finally {
    clearAuthStorage();
  }
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me");
}

export { getStoredUser };

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}
