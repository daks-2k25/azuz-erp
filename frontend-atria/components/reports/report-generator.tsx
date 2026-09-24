"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ClipboardList, Download, Link2, Loader2 } from "lucide-react";
import { ReportExportView } from "@/components/reports/report-export-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { formatReportPeriod } from "@/lib/report-utils";
import { clientsService, portalService, reportsService } from "@/services";
import type { Client, ClientReport } from "@/services/types";

const MONTHS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export function ReportGenerator() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<ClientReport | null>(null);
  const [portalCredentials, setPortalCredentials] = useState<{
    email: string;
    temporaryPassword: string;
    loginUrl: string;
  } | null>(null);
  const [portalDialogOpen, setPortalDialogOpen] = useState(false);
  const [generatingPortal, setGeneratingPortal] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void clientsService.getClients().then(setClients).catch(() => setClients([]));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!clientId) return;
    setGenerating(true);
    try {
      const result = await reportsService.generateReport(clientId, { month, year });
      setReport(result);
    } catch {
      setReport(null);
    } finally {
      setGenerating(false);
    }
  }, [clientId, month, year]);

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePortal = async () => {
    if (!clientId) return;
    setGeneratingPortal(true);
    try {
      const result = await portalService.provisionPortalAccess(clientId);
      const loginUrl = `${window.location.origin}${result.loginUrl}`;
      setPortalCredentials({
        email: result.email,
        temporaryPassword: result.temporaryPassword,
        loginUrl,
      });
      setPortalDialogOpen(true);
    } finally {
      setGeneratingPortal(false);
    }
  };

  const copyPortalCredentials = async () => {
    if (!portalCredentials) return;
    await navigator.clipboard.writeText(
      `Portal: ${portalCredentials.loginUrl}\nE-mail: ${portalCredentials.email}\nSenha: ${portalCredentials.temporaryPassword}`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="grid flex-1 gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="report-client">Cliente</FieldLabel>
              <select
                id="report-client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="">Selecione o cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="report-month">Mês</FieldLabel>
              <select
                id="report-month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="report-year">Ano</FieldLabel>
              <select
                id="report-year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => void handleGenerate()}
              disabled={!clientId || generating}
              className="bg-[var(--atria-primary)] hover:bg-[var(--atria-primary)]/90"
            >
              {generating ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <ClipboardList className="mr-2 size-4" />
              )}
              Gerar Relatório
            </Button>
            <Button
              variant="outline"
              onClick={() => void handleGeneratePortal()}
              disabled={!clientId || generatingPortal}
            >
              {generatingPortal ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Link2 className="mr-2 size-4" />
              )}
              Acesso ao Portal
            </Button>
          </div>
        </div>
      </Card>

      {report && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between print:hidden">
            <div>
              <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
                {report.title}
              </h2>
              <p className="text-sm text-[var(--atria-primary)]/50">
                {formatReportPeriod(report.month, report.year)}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="border-[var(--atria-accent)] text-[var(--atria-primary)]"
            >
              <Download className="mr-2 size-4" />
              Exportar PDF
            </Button>
          </div>
          <div className="print-report-container overflow-hidden rounded-2xl border border-[var(--atria-primary)]/10 shadow-sm">
            <ReportExportView ref={printRef} report={report} />
          </div>
        </div>
      )}

      <Dialog open={portalDialogOpen} onOpenChange={setPortalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acesso ao Portal do Cliente</DialogTitle>
            <DialogDescription>
              Compartilhe as credenciais abaixo. O cliente deve acessar o portal
              com login e senha.
            </DialogDescription>
          </DialogHeader>
          {portalCredentials && (
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="text-xs uppercase text-muted-foreground">URL</p>
                <code className="break-all rounded-lg bg-muted p-3 text-sm">
                  {portalCredentials.loginUrl}
                </code>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">E-mail</p>
                <p className="font-mono">{portalCredentials.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Senha</p>
                <p className="font-mono">{portalCredentials.temporaryPassword}</p>
              </div>
              <Button onClick={() => void copyPortalCredentials()}>
                Copiar credenciais
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
