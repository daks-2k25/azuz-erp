"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LeadsKanbanBoard } from "@/components/leads/leads-kanban-board";
import { PortalShell } from "@/components/portal/portal-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { isCrmEnabledForUser } from "@/lib/crm-access";
import * as clientPortalService from "@/services/client-portal.service";
import type { PortalData } from "@/services/types";

export function ClientPortalCrmContent() {
  const { logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPortal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await clientPortalService.getPortalData();
      setData(result);
      if (!isCrmEnabledForUser(result.client?.hasCrmEnabled)) {
        router.replace("/client-portal");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível carregar o portal.";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadPortal();
  }, [loadPortal]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F6]">
        <Loader2 className="size-8 animate-spin text-[var(--atria-primary)]" />
      </div>
    );
  }

  if (error || !data?.client) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F8F6] p-6 text-center">
        <p className="max-w-md text-sm text-[var(--atria-primary)]/60">
          {error ?? "Não foi possível carregar o CRM do portal."}
        </p>
        <Button variant="outline" render={<Link href="/client-portal" />}>
          <ArrowLeft className="mr-2 size-4" />
          Voltar ao portal
        </Button>
      </div>
    );
  }

  return (
    <PortalShell
      data={data}
      onLogout={() => void logout()}
      activeTab="crm"
      onTabChange={(tab) => {
        if (tab === "crm") return;
        router.push(`/client-portal?tab=${tab}`);
      }}
      hasCrmEnabled={isCrmEnabledForUser(data.client?.hasCrmEnabled)}
    >
      <LeadsKanbanBoard portalClientView />
    </PortalShell>
  );
}
