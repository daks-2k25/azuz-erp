"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Loader2, LogOut, Shield } from "lucide-react";
import { PortalContentDashboard } from "@/components/portal/portal-content-dashboard";
import { PortalAssetsDropzone } from "@/components/portal/portal-assets-dropzone";
import { PortalCalendarView } from "@/components/portal/portal-calendar-view";
import { PortalContractsCenter } from "@/components/portal/portal-contracts-center";
import { PortalReportsViewer } from "@/components/portal/portal-reports-viewer";
import { PortalFinanceDashboard } from "@/components/portal/portal-finance-dashboard";
import { PortalCrmPanel } from "@/components/portal/portal-crm-panel";
import { PortalRequestsPanel } from "@/components/portal/portal-requests-panel";
import { PortalShell } from "@/components/portal/portal-shell";
import { type PortalTab } from "@/components/portal/portal-sidebar";
import type { PortalActionHandlers } from "@/components/portal/portal-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { isCrmEnabledForUser } from "@/lib/crm-access";
import * as clientPortalService from "@/services/client-portal.service";
import type { PortalData } from "@/services/types";

const RBAC_PORTAL_ACTIONS: PortalActionHandlers = {
  approvePost: clientPortalService.approvePortalPost,
  rejectPost: clientPortalService.rejectPortalPost,
  getContract: clientPortalService.getPortalContract,
  signContract: clientPortalService.signPortalContract,
  getReport: clientPortalService.getPortalReport,
  uploadAsset: clientPortalService.uploadPortalAsset,
  submitBriefing: clientPortalService.submitPortalBriefing,
  listRequests: clientPortalService.listRequests,
  createRequest: clientPortalService.createRequest,
  addRequestComment: clientPortalService.addRequestComment,
  getDeliverableFullView: clientPortalService.getDeliverableFullView,
  listDeliverables: clientPortalService.listDeliverables,
  reviseDeliverableItem: clientPortalService.reviseDeliverableItem,
  resolveAssetUrl: clientPortalService.resolvePortalAssetUrl,
};

const PORTAL_TABS: PortalTab[] = [
  "approval",
  "requests",
  "calendar",
  "contracts",
  "reports",
  "assets",
  "finance",
  "crm",
];

export function RbacClientPortalApp() {
  const { logout, user } = useAuth();
  const searchParams = useSearchParams();
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PortalTab>("approval");

  const hasCrmEnabled = isCrmEnabledForUser(
    data?.client?.hasCrmEnabled ?? user?.hasCrmEnabled,
  );

  const loadPortal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await clientPortalService.getPortalData();
      setData(result);
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
  }, []);

  useEffect(() => {
    void loadPortal();
  }, [loadPortal]);

  useEffect(() => {
    const requestedTab = searchParams.get("tab") as PortalTab | null;
    if (!requestedTab || !PORTAL_TABS.includes(requestedTab)) {
      return;
    }
    if (requestedTab === "crm" && !hasCrmEnabled) {
      setActiveTab("approval");
      return;
    }
    setActiveTab(requestedTab);
  }, [hasCrmEnabled, searchParams]);

  useEffect(() => {
    if (activeTab === "crm" && !hasCrmEnabled) {
      setActiveTab("approval");
    }
  }, [activeTab, hasCrmEnabled]);

  const loadCalendar = useCallback(
    (from: string, to: string) => clientPortalService.getCalendar(from, to),
    [],
  );

  const contentActions = useMemo(
    () => ({
      approvePost: RBAC_PORTAL_ACTIONS.approvePost,
      rejectPost: RBAC_PORTAL_ACTIONS.rejectPost,
      resolveAssetUrl: RBAC_PORTAL_ACTIONS.resolveAssetUrl,
      getDeliverableFullView: RBAC_PORTAL_ACTIONS.getDeliverableFullView,
      listDeliverables: RBAC_PORTAL_ACTIONS.listDeliverables,
      reviseDeliverableItem: RBAC_PORTAL_ACTIONS.reviseDeliverableItem,
    }),
    [],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--atria-base,#F8F8F6)]">
        <Loader2 className="size-8 animate-spin text-[var(--atria-primary)]" />
      </div>
    );
  }

  if (error || !data?.client) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--atria-base,#F8F8F6)] p-6 text-center">
        <Shield className="size-12 text-[var(--atria-primary)]/30" />
        <h1 className="text-xl font-semibold text-[var(--atria-primary)]">
          Acesso não disponível
        </h1>
        <p className="max-w-md text-sm text-[var(--atria-primary)]/60">
          {error ??
            "Sua conta de cliente não está vinculada a uma empresa. Contate a agência."}
        </p>
        <Button variant="outline" onClick={() => void logout()}>
          <LogOut className="mr-2 size-4" />
          Sair
        </Button>
      </div>
    );
  }

  const { accountStatus } = data;

  return (
    <PortalShell
      data={data}
      onLogout={() => void logout()}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      hasCrmEnabled={hasCrmEnabled}
      tabCounts={{
        approval: accountStatus.pendingApprovals,
        contracts: data.contracts.length,
        reports: data.recentReports.length,
      }}
    >
      {activeTab === "approval" && (
        <PortalContentDashboard
          pipeline={data.contentPipeline ?? []}
          onRefresh={loadPortal}
          onOpenRequests={() => setActiveTab("requests")}
          actions={contentActions}
        />
      )}
      {activeTab === "requests" && (
        <PortalRequestsPanel actions={RBAC_PORTAL_ACTIONS} />
      )}
      {activeTab === "calendar" && (
        <PortalCalendarView loadCalendar={loadCalendar} />
      )}
      {activeTab === "contracts" && (
        <PortalContractsCenter
          contracts={data.contracts}
          onRefresh={loadPortal}
          actions={RBAC_PORTAL_ACTIONS}
        />
      )}
      {activeTab === "reports" && (
        <PortalReportsViewer
          reports={data.recentReports}
          actions={RBAC_PORTAL_ACTIONS}
        />
      )}
      {activeTab === "finance" && (
        <PortalFinanceDashboard
          loadFinances={() => clientPortalService.getFinances()}
          loadFinanceDocuments={() =>
            clientPortalService.listFinanceDocuments()
          }
          uploadFinanceDocument={(file) =>
            clientPortalService.uploadFinanceDocument(file)
          }
          resolveAssetUrl={clientPortalService.resolvePortalAssetUrl}
        />
      )}
      {activeTab === "crm" && hasCrmEnabled && data.client && (
        <PortalCrmPanel companyName={data.client.companyName} />
      )}
      {activeTab === "assets" && (
        <PortalAssetsDropzone
          recentBriefs={data.recentBriefs ?? []}
          onRefresh={loadPortal}
          actions={RBAC_PORTAL_ACTIONS}
        />
      )}
    </PortalShell>
  );
}
