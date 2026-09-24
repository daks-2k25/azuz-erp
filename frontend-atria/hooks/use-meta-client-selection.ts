"use client";

import { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMetaClients } from "@/hooks/use-meta-analytics";
import type { MetaAdAccountClient, MetaDatePreset } from "@/services/types";

export const DEFAULT_META_CLIENT_ID = "act_781471881330330";
export const DEFAULT_META_DATE_PRESET: MetaDatePreset = "last_90d";

function resolveDefaultClientId(clients: MetaAdAccountClient[]) {
  const preferred = clients.find(
    (client) =>
      client.id === DEFAULT_META_CLIENT_ID ||
      client.accountId === "781471881330330",
  );
  return preferred?.id ?? clients[0]?.id ?? DEFAULT_META_CLIENT_ID;
}

export function useMetaClientSelection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nameSearch = searchParams.get("search") ?? "";
  const { data, isLoading, isError, error, refetch } = useMetaClients(
    nameSearch || undefined,
  );

  const clients = data?.clients ?? [];

  const selectedClientId = useMemo(() => {
    const fromUrl = searchParams.get("clientId");
    if (!fromUrl) return resolveDefaultClientId(clients);
    const matched = clients.find(
      (client) => client.id === fromUrl || client.accountId === fromUrl,
    );
    return matched?.id ?? resolveDefaultClientId(clients);
  }, [clients, searchParams]);

  const datePreset = (searchParams.get("datePreset") as MetaDatePreset | null) ??
    DEFAULT_META_DATE_PRESET;
  const month = searchParams.get("month")
    ? Number(searchParams.get("month"))
    : undefined;
  const year = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : undefined;

  const updateParams = useCallback(
    (patch: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const setSelectedClientId = useCallback(
    (clientId: string) => updateParams({ clientId }),
    [updateParams],
  );

  const setDatePreset = useCallback(
    (preset: MetaDatePreset) =>
      updateParams({
        datePreset: preset,
        month: null,
        year: null,
      }),
    [updateParams],
  );

  const setMonthFilter = useCallback(
    (nextMonth?: number, nextYear?: number) => {
      if (!nextMonth || !nextYear) {
        updateParams({ month: null, year: null });
        return;
      }
      updateParams({
        month: String(nextMonth),
        year: String(nextYear),
        datePreset: null,
      });
    },
    [updateParams],
  );

  const setSearch = useCallback(
    (search: string) => updateParams({ search: search || null }),
    [updateParams],
  );

  useEffect(() => {
    if (isLoading || clients.length === 0) return;

    const fromUrl = searchParams.get("clientId");
    const hasValidSelection = clients.some(
      (client) => client.id === fromUrl || client.accountId === fromUrl,
    );

    if (!hasValidSelection) {
      setSelectedClientId(resolveDefaultClientId(clients));
    }
  }, [clients, isLoading, searchParams, setSelectedClientId]);

  return {
    clients,
    selectedClientId,
    setSelectedClientId,
    datePreset,
    setDatePreset,
    month,
    year,
    setMonthFilter,
    nameSearch,
    setSearch,
    isLoadingClients: isLoading,
    isClientsError: isError,
    clientsError: error,
    refetchClients: refetch,
    source: data?.source,
  };
}
