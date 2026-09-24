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
} from "@/components/ui/dialog";
import { clientGroupsService } from "@/services";
import { toast } from "@/lib/toast";
import type { CreateClientGroupInput } from "@/services/types";
import * as XLSX from "xlsx";

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function mapRowToGroup(
  row: Record<string, unknown>,
): CreateClientGroupInput | null {
  const entries = Object.entries(row).map(([key, value]) => [
    normalizeHeader(key),
    String(value ?? "").trim(),
  ]);
  const map = Object.fromEntries(entries);

  const name = map.nome || map.name || map.grupo || map.group;
  if (!name) return null;

  return {
    name,
    description: map.descricao || map.description || map.obs || undefined,
    color: map.cor || map.color || undefined,
  };
}

interface ClientGroupsImportSectionProps {
  onSuccess: () => void;
}

export function ClientGroupsImportSection({
  onSuccess,
}: ClientGroupsImportSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);
  const [groups, setGroups] = useState<CreateClientGroupInput[]>([]);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
      const parsed = rows
        .map(mapRowToGroup)
        .filter((row): row is CreateClientGroupInput => row !== null);

      setGroups(parsed);
      setPreviewCount(parsed.length);
    };
    reader.readAsArrayBuffer(file);
  }

  async function handleImport() {
    if (groups.length === 0) return;
    setLoading(true);
    try {
      const result = await clientGroupsService.bulkImportClientGroups(groups);
      toast.success(`${result.created} grupo(s) importado(s)`);
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} linha(s) com erro`);
      }
      setGroups([]);
      setPreviewCount(0);
      onSuccess();
    } catch {
      toast.error("Não foi possível importar os grupos.");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="rounded-xl border border-[var(--atria-primary)]/10 p-4">
    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--atria-primary)]">
      <FileSpreadsheet className="size-4" />
      Importar grupos (.xlsx / .csv)
    </div>
    <p className="mb-3 text-xs text-[var(--atria-primary)]/55">
      Colunas sugeridas: nome, descrição, cor.
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
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-4" />
        Selecionar arquivo
      </Button>
      <Button
        type="button"
        size="sm"
        disabled={loading || groups.length === 0}
        className="bg-[var(--atria-primary)] text-white"
        onClick={() => void handleImport()}
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Importar"}
      </Button>
    </div>
    {previewCount > 0 && (
      <p className="mt-2 text-xs text-[var(--atria-primary)]">
        {previewCount} registro(s) pronto(s).
      </p>
    )}
  </div>
  );
}
