"use client";

import { useRef, useState } from "react";
import { FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { clientsService } from "@/services";
import { toast } from "@/lib/toast";
import type { CreateClientInput } from "@/services/types";
import * as XLSX from "xlsx";

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function mapRowToClient(row: Record<string, unknown>): CreateClientInput | null {
  const entries = Object.entries(row).map(([key, value]) => [
    normalizeHeader(key),
    String(value ?? "").trim(),
  ]);
  const map = Object.fromEntries(entries);

  const companyName =
    map.empresa || map.company || map.companyname || map.nome || map.razao_social;
  if (!companyName) return null;

  return {
    companyName,
    contactName: map.contato || map.contact || map.contactname || undefined,
    document: map.cpf || map.cnpj || map.document || map.documento || undefined,
    email: map.email || map["e-mail"] || undefined,
    phone: map.telefone || map.phone || map.celular || undefined,
    street: map.rua || map.street || map.logradouro || undefined,
    number: map.numero || map.number || map.n || undefined,
    neighborhood: map.bairro || map.neighborhood || undefined,
    city: map.cidade || map.city || undefined,
    state: map.estado || map.state || map.uf || undefined,
    zipCode: map.cep || map.zipcode || map.zip || undefined,
    notes: map.observacoes || map.notes || map.obs || undefined,
  };
}

interface ClientsImportDialogProps {
  onSuccess: () => void;
}

export function ClientsImportDialog({ onSuccess }: ClientsImportDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);
  const [clients, setClients] = useState<CreateClientInput[]>([]);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
      const parsed = rows
        .map(mapRowToClient)
        .filter((row): row is CreateClientInput => row !== null);

      setClients(parsed);
      setPreviewCount(parsed.length);
    };
    reader.readAsArrayBuffer(file);
  }

  async function handleImport() {
    if (clients.length === 0) return;
    setLoading(true);
    try {
      const result = await clientsService.bulkImportClients(clients);
      toast.success(`${result.created} cliente(s) importado(s)`);
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} linha(s) com erro`);
      }
      setOpen(false);
      setClients([]);
      setPreviewCount(0);
      onSuccess();
    } catch {
      toast.error("Não foi possível importar os clientes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="border-[var(--atria-primary)]/20" />
        }
      >
        <FileSpreadsheet className="size-4" />
        Importar Excel
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--atria-primary)]">
            Importar clientes (.xlsx / .csv)
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[var(--atria-primary)]/55">
          Colunas sugeridas: empresa, contato, cpf/cnpj, email, telefone, rua,
          número, bairro, cidade, estado, cep.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4" />
          Selecionar arquivo
        </Button>
        {previewCount > 0 && (
          <p className="text-sm text-[var(--atria-primary)]">
            {previewCount} registro(s) pronto(s) para importação.
          </p>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={loading || clients.length === 0}
            className="bg-[var(--atria-primary)] text-white"
            onClick={() => void handleImport()}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Importar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
