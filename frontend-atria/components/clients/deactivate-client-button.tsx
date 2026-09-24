"use client";

import { useState } from "react";
import { Loader2, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/contexts/confirm-context";
import { usePermissions } from "@/hooks/use-permissions";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { clientsService } from "@/services";
import type { Client } from "@/services/types";

interface DeactivateClientButtonProps {
  client: Pick<Client, "id" | "companyName" | "isActive">;
  onUpdated?: () => void;
  variant?: "default" | "prominent";
}

export function DeactivateClientButton({
  client,
  onUpdated,
  variant = "default",
}: DeactivateClientButtonProps) {
  const confirm = useConfirm();
  const { canDeactivateUsers } = usePermissions();
  const [submitting, setSubmitting] = useState(false);
  const isActive = client.isActive !== false;

  if (!canDeactivateUsers()) {
    return null;
  }

  async function handleToggle() {
    const activating = !isActive;
    const confirmed = await confirm({
      title: activating ? "Reativar cliente" : "Desativar cliente",
      description: activating
        ? `Deseja reativar o acesso de ${client.companyName} ao portal e aos usuários vinculados?`
        : `Isso desativará o acesso ao portal e de todos os usuários vinculados a ${client.companyName}. Deseja continuar?`,
      destructive: !activating,
      confirmLabel: activating ? "Reativar cliente" : "Desativar cliente",
    });
    if (!confirmed) return;

    setSubmitting(true);
    try {
      if (activating) {
        await clientsService.activateClient(client.id);
        toast.success("Cliente reativado com sucesso.");
      } else {
        await clientsService.deactivateClient(client.id);
        toast.success("Cliente desativado com sucesso.");
      }
      onUpdated?.();
    } catch {
      toast.error(
        activating
          ? "Não foi possível reativar o cliente."
          : "Não foi possível desativar o cliente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const prominent = variant === "prominent";

  return (
    <Button
      type="button"
      variant={prominent ? "default" : "outline"}
      size={prominent ? "sm" : "sm"}
      onClick={() => void handleToggle()}
      disabled={submitting}
      className={cn(
        "gap-2",
        prominent
          ? isActive
            ? "border border-red-300 bg-red-600 text-white shadow-sm hover:bg-red-700"
            : "border border-emerald-300 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
          : isActive
            ? "border-red-200 text-red-700 hover:bg-red-50"
            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
      )}
    >
      {submitting ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isActive ? (
        <UserX className="size-4" />
      ) : (
        <UserCheck className="size-4" />
      )}
      {isActive ? "Desativar Cliente" : "Reativar Cliente"}
    </Button>
  );
}
