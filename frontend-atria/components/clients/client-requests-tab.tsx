"use client";

import { ClientRequestsWorkspace } from "@/components/clients/client-requests-workspace";

interface ClientRequestsTabProps {
  clientId: string;
  clientName: string;
  onUpdated?: () => void;
}

export function ClientRequestsTab({
  clientId,
  clientName,
  onUpdated,
}: ClientRequestsTabProps) {
  return (
    <ClientRequestsWorkspace
      clientId={clientId}
      clientName={clientName}
      onUpdated={onUpdated}
      layout="page"
    />
  );
}
