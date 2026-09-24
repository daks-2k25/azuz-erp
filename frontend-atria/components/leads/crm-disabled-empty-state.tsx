"use client";

import Link from "next/link";
import { ArrowLeft, KanbanSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CrmDisabledEmptyState() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg rounded-2xl border-[var(--atria-primary)]/10 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[var(--atria-primary)]/8 text-[var(--atria-primary)]">
          <KanbanSquare className="size-7" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
          CRM indisponível
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--atria-primary)]/60">
          O módulo de CRM não está ativado para esta empresa.
        </p>
        <Button
          className="mt-6 bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
          render={<Link href="/clients" />}
        >
          <ArrowLeft className="size-4" />
          Voltar para clientes
        </Button>
      </Card>
    </div>
  );
}
