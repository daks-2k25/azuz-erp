import type { AddLeadToKanbanInput } from "@/services/types";
import * as XLSX from "xlsx";

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function pickValue(map: Record<string, string>, ...keys: string[]) {
  for (const key of keys) {
    const value = map[key];
    if (value) return value;
  }
  return undefined;
}

export function mapRowToKanbanLead(
  row: Record<string, unknown>,
  source: "excel" | "manual" = "excel",
): AddLeadToKanbanInput | null {
  const entries = Object.entries(row).map(([key, value]) => [
    normalizeHeader(key),
    String(value ?? "").trim(),
  ]);
  const map = Object.fromEntries(entries) as Record<string, string>;

  const name = pickValue(
    map,
    "empresa",
    "name",
    "nome",
    "company",
    "companyname",
    "title",
    "razao_social",
  );

  if (!name) return null;

  const mapsLink = pickValue(map, "link maps", "link_maps", "linkmaps");
  let placeId = pickValue(map, "placeid", "place_id");
  if (!placeId && mapsLink) {
    placeId = extractPlaceIdFromMapsUrl(mapsLink);
  }

  return {
    name,
    phone: pickValue(map, "telefone", "phone", "celular", "whatsapp"),
    email: pickValue(map, "email", "e-mail"),
    website: pickValue(map, "website", "site"),
    category: pickValue(map, "categoria", "category"),
    neighborhood: pickValue(map, "bairro", "neighborhood"),
    city: pickValue(map, "cidade", "city"),
    address: pickValue(map, "endereco", "endereço", "address"),
    placeId,
    source,
  };
}

function extractPlaceIdFromMapsUrl(url: string): string | undefined {
  const hexMatch = url.match(/0x[a-f0-9]+:0x[a-f0-9]+/i);
  if (hexMatch) return hexMatch[0];

  const placeMatch = url.match(/\/place\/([^/]+)\//i);
  if (placeMatch) {
    return decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
  }

  return undefined;
}

function findHeaderRowIndex(rows: unknown[][]): number {
  for (let index = 0; index < Math.min(rows.length, 25); index += 1) {
    const row = rows[index];
    if (!Array.isArray(row)) continue;

    const normalized = row.map((cell) => normalizeHeader(String(cell ?? "")));
    const hasEmpresa = normalized.some(
      (cell) => cell === "empresa" || cell === "name" || cell === "nome",
    );
    const hasPhone = normalized.some(
      (cell) =>
        cell === "telefone" ||
        cell === "phone" ||
        cell === "celular" ||
        cell === "whatsapp",
    );

    if (hasEmpresa && hasPhone) {
      return index;
    }
  }

  return 0;
}

export function parseLeadsWorkbook(workbook: XLSX.WorkBook): AddLeadToKanbanInput[] {
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];

  const sheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
  });

  const headerRowIndex = findHeaderRowIndex(matrix);
  const headerRow = matrix[headerRowIndex] ?? [];
  const headers = headerRow.map((cell) => String(cell ?? "").trim());

  const leads: AddLeadToKanbanInput[] = [];

  for (let rowIndex = headerRowIndex + 1; rowIndex < matrix.length; rowIndex += 1) {
    const row = matrix[rowIndex];
    if (!Array.isArray(row)) continue;

    const record: Record<string, unknown> = {};
    let hasContent = false;

    headers.forEach((header, columnIndex) => {
      if (!header) return;
      const value = row[columnIndex];
      const text = String(value ?? "").trim();
      if (text) hasContent = true;
      record[header] = text;
    });

    if (!hasContent) continue;

    const mapped = mapRowToKanbanLead(record, "excel");
    if (mapped) leads.push(mapped);
  }

  return leads;
}

export async function downloadLeadsImportTemplate() {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Leads");

  sheet.mergeCells("A1:H1");
  sheet.getCell("A1").value = "LeadMiner - Lista de Leads";
  sheet.getCell("A1").font = { bold: true, size: 12 };
  sheet.getCell("A2").value = `Gerado em: ${new Date().toLocaleString("pt-BR")}`;

  sheet.getRow(4).values = [
    "Empresa",
    "Telefone",
    "Website",
    "Endereço",
    "Cidade",
    "Categoria",
    "Link Maps",
    "Capturado em",
  ];
  sheet.getRow(4).font = { bold: true };

  sheet.addRow([
    "Exemplo Restaurante Ltda",
    "(31) 99999-9999",
    "https://exemplo.com",
    "R. Exemplo, 100 - Centro, Belo Horizonte - MG",
    "Belo Horizonte",
    "Restaurante",
    "https://www.google.com/maps/place/...",
    new Date().toLocaleString("pt-BR"),
  ]);

  sheet.columns = [
    { width: 34 },
    { width: 18 },
    { width: 28 },
    { width: 40 },
    { width: 20 },
    { width: 22 },
    { width: 36 },
    { width: 18 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "modelo-importacao-leads.xlsx";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function readLeadsFromArrayBuffer(data: ArrayBuffer): AddLeadToKanbanInput[] {
  const workbook = XLSX.read(data, { type: "array" });
  return parseLeadsWorkbook(workbook);
}
