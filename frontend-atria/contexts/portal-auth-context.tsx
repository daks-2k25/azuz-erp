"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  clearPortalAuthStorage,
  getPortalAccessToken,
  getPortalClient,
  setPortalClient,
  setPortalTokens,
  type PortalClientSession,
} from "@/lib/portal-auth-storage";
import { portalService } from "@/services";

interface PortalAuthContextValue {
  client: PortalClientSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const PortalAuthContext = createContext<PortalAuthContextValue | null>(null);

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [client, setClient] = useState<PortalClientSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setClient(getPortalClient());
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string, remember = true) => {
      const result = await portalService.login(email, password);
      setPortalTokens(result.accessToken, result.refreshToken, remember);
      setPortalClient(result.client, remember);
      setClient(result.client);
      router.push("/portal/dashboard");
    },
    [router],
  );

  const logout = useCallback(async () => {
    await portalService.logout();
    clearPortalAuthStorage();
    setClient(null);
    router.push("/portal/login");
  }, [router]);

  const value = useMemo(
    () => ({
      client,
      isAuthenticated: Boolean(getPortalAccessToken() && client),
      loading,
      login,
      logout,
    }),
    [client, loading, login, logout],
  );

  return (
    <PortalAuthContext.Provider value={value}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const context = useContext(PortalAuthContext);
  if (!context) {
    throw new Error("usePortalAuth must be used within PortalAuthProvider");
  }
  return context;
}
