"use client";

import { useState } from "react";
import {
  Eye,
  FileSignature,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { ClientName } from "@/components/ui/client-name";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContractFormDialog } from "@/components/contracts/contract-form-dialog";
import { ContractPdfViewerDialog } from "@/components/contracts/contract-pdf-viewer-dialog";
import { ContractPreviewDialog } from "@/components/contracts/contract-preview-dialog";
import {
  formatCurrency,
  formatDate,
  FREQUENCY_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/lib/contract-utils";
import { contractsService, ApiError } from "@/services";
import { toast } from "@/lib/toast";
import type { Contract } from "@/services/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ContractsTableProps {
  contracts: Contract[];
  onRefresh: () => void;
  loading?: boolean;
}

export function ContractsTable({
  contracts,
  onRefresh,
  loading,
}: ContractsTableProps) {
  const [previewContract, setPreviewContract] = useState<Contract | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfContract, setPdfContract] = useState<Contract | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [signingContract, setSigningContract] = useState<Contract | null>(null);
  const [signOpen, setSignOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [signResult, setSignResult] = useState<number | null>(null);

  async function handleSign() {
    if (!signingContract) return;

    setActionLoading(true);
    setActionError(null);

    try {
      const result = await contractsService.signContract(signingContract.id);
      setSignResult(result.receivablesGenerated);
      setSignOpen(false);
      onRefresh();
      toast.success("Contrato assinado com sucesso!");
    } catch (err) {
      if (!(err instanceof ApiError)) {
        setActionError("Não foi possível assinar o contrato.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(contract: Contract) {
    if (!confirm(`Excluir o contrato "${contract.title}"?`)) return;

    try {
      await contractsService.deleteContract(contract.id);
      onRefresh();
      toast.info("Contrato removido");
    } catch (err) {
      if (!(err instanceof ApiError)) {
        toast.error("Não foi possível excluir o contrato.");
      }
    }
  }

  return (
    <>
      {signResult !== null && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Contrato assinado! {signResult} recebível(is) gerado(s) no módulo
          financeiro.
        </div>
      )}

      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[var(--atria-primary)]/50">
                Contrato
              </TableHead>
              <TableHead className="text-[var(--atria-primary)]/50">
                Cliente
              </TableHead>
              <TableHead className="text-[var(--atria-primary)]/50">
                Valor
              </TableHead>
              <TableHead className="text-[var(--atria-primary)]/50">
                Vigência
              </TableHead>
              <TableHead className="text-[var(--atria-primary)]/50">
                Status
              </TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm">
                  Nenhum contrato encontrado.
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewContract(contract);
                        setPreviewOpen(true);
                      }}
                      className="text-left font-medium text-[var(--atria-primary)] hover:underline"
                    >
                      {contract.title}
                    </button>
                    <p className="text-xs text-[var(--atria-primary)]/40">
                      {FREQUENCY_LABELS[contract.paymentFrequency]}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        {contract.client.avatarUrl && (
                          <AvatarImage src={contract.client.avatarUrl} />
                        )}
                        <AvatarFallback className="bg-[var(--atria-accent)] text-[9px] text-[var(--atria-primary)]">
                          {getInitials(contract.client.companyName)}
                        </AvatarFallback>
                      </Avatar>
                      <ClientName className="text-sm text-[var(--atria-primary)]/70">
                        {contract.client.companyName}
                      </ClientName>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-[var(--atria-primary)]">
                    {formatCurrency(contract.recurringValue)}
                  </TableCell>
                  <TableCell className="text-sm text-[var(--atria-primary)]/60">
                    {formatDate(contract.startDate)}
                    {contract.endDate && (
                      <>
                        <br />
                        até {formatDate(contract.endDate)}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_STYLES[contract.status]}>
                      {STATUS_LABELS[contract.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-sm" />}
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setPdfContract(contract);
                            setPdfOpen(true);
                          }}
                        >
                          <FileText className="size-4" />
                          Visualizar PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setPreviewContract(contract);
                            setPreviewOpen(true);
                          }}
                        >
                          <Eye className="size-4" />
                          Visualizar
                        </DropdownMenuItem>
                        {contract.status !== "signed" && (
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingContract(contract);
                              setEditOpen(true);
                            }}
                          >
                            <Pencil className="size-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {contract.status !== "signed" &&
                          contract.status !== "cancelled" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSigningContract(contract);
                                setSignOpen(true);
                              }}
                            >
                              <FileSignature className="size-4" />
                              Marcar como Assinado
                            </DropdownMenuItem>
                          )}
                        {contract.status !== "signed" && (
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => void handleDelete(contract)}
                          >
                            <Trash2 className="size-4" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <ContractPreviewDialog
        contract={previewContract}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      <ContractPdfViewerDialog
        contract={pdfContract}
        open={pdfOpen}
        onOpenChange={(value) => {
          setPdfOpen(value);
          if (!value) setPdfContract(null);
        }}
      />

      <ContractFormDialog
        contract={editingContract}
        open={editOpen}
        onOpenChange={(value) => {
          setEditOpen(value);
          if (!value) setEditingContract(null);
        }}
        onSuccess={() => {
          setEditingContract(null);
          onRefresh();
        }}
        trigger={false}
      />

      <Dialog
        open={signOpen}
        onOpenChange={(value) => {
          setSignOpen(value);
          if (!value) {
            setSigningContract(null);
            setActionError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--atria-primary)]">
              Assinar Contrato
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--atria-primary)]/70">
            Ao marcar &quot;{signingContract?.title}&quot; como assinado, o
            sistema gerará automaticamente as contas a receber no módulo
            financeiro com base no valor e na frequência de pagamento.
          </p>
          {actionError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {actionError}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSignOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={actionLoading}
              onClick={() => void handleSign()}
              className="bg-[var(--atria-primary)] text-white"
            >
              {actionLoading ? "Processando..." : "Confirmar Assinatura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
