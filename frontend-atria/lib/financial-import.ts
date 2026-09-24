import * as XLSX from "xlsx";

export type ImportFinanceTransactionType = "expense" | "income";

export interface ImportFinanceTransactionInput {
  categoryName: string;
  description: string;
  amount: number;
  date: string;
  dueDate?: string;
  status?: "paid" | "pending" | "overdue";
  type?: ImportFinanceTransactionType;
  companyName?: string;
  managerName?: string;
  serviceName?: string;
  reference?: string;
}

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\.+$/g, "");
}

function pickValue(map: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = map[key];
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return undefined;
}

function normalizeAmountString(raw: string): string {
  let s = raw.replace(/[R$\s]/g, "").trim();
  if (!s) return "";

  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      return s.replace(/\./g, "").replace(",", ".");
    }
    return s.replace(/,/g, "");
  }

  if (lastComma >= 0) {
    const fractional = s.slice(lastComma + 1);
    if (fractional.length <= 2) {
      return s.replace(",", ".");
    }
    return s.replace(/,/g, "");
  }

  if (lastDot >= 0) {
    const fractional = s.slice(lastDot + 1);
    const dotCount = (s.match(/\./g) ?? []).length;

    if (dotCount > 1) {
      return s.replace(/\./g, "");
    }

    if (fractional.length === 3) {
      return s.replace(/\./g, "");
    }

    return s;
  }

  return s;
}

function parseAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value * 100) / 100;
  }

  const raw = String(value ?? "").trim();
  if (!raw) return null;

  const normalized = normalizeAmountString(raw);
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed * 100) / 100;
}

function parseExcelDate(
  value: unknown,
  options?: { preferMonthFirst?: boolean },
): string | null {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatLocalDate(
      value.getFullYear(),
      value.getMonth() + 1,
      value.getDate(),
    );
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (!parsed) return null;
    return formatLocalDate(parsed.y, parsed.m, parsed.d);
  }

  const raw = String(value).trim();
  if (!raw) return null;

  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  const slashMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (slashMatch) {
    const first = Number(slashMatch[1]);
    const second = Number(slashMatch[2]);
    const year =
      slashMatch[3].length === 2
        ? 2000 + Number(slashMatch[3])
        : Number(slashMatch[3]);

    const dayMonth = resolveSlashDateParts(first, second, options?.preferMonthFirst);
    if (!dayMonth) return null;

    return formatLocalDate(year, dayMonth.month, dayMonth.day);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return formatLocalDate(
    parsed.getFullYear(),
    parsed.getMonth() + 1,
    parsed.getDate(),
  );
}

function resolveSlashDateParts(
  first: number,
  second: number,
  preferMonthFirst = false,
): { day: number; month: number } | null {
  if (preferMonthFirst) {
    if (first > 12) {
      return { day: first, month: second };
    }
    if (second > 12) {
      return { day: second, month: first };
    }
    return { day: second, month: first };
  }

  if (first > 12) {
    return { day: first, month: second };
  }
  if (second > 12) {
    return { day: second, month: first };
  }

  return { day: first, month: second };
}

function formatLocalDate(year: number, month: number, day: number) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseStatus(value: string | undefined): ImportFinanceTransactionInput["status"] {
  const normalized = normalizeHeader(value ?? "");
  if (!normalized) return "pending";
  if (
    normalized.includes("pago") ||
    normalized.includes("paid") ||
    normalized.includes("quitad")
  ) {
    return "paid";
  }
  if (
    normalized.includes("vencid") ||
    normalized.includes("overdue") ||
    normalized.includes("atrasad")
  ) {
    return "overdue";
  }
  return "pending";
}

function parseTransactionType(
  value: string | undefined,
): ImportFinanceTransactionType | undefined {
  const normalized = normalizeHeader(value ?? "");
  if (!normalized) return undefined;
  if (normalized.includes("receita") || normalized.includes("income")) {
    return "income";
  }
  if (normalized.includes("despesa") || normalized.includes("expense")) {
    return "expense";
  }
  return undefined;
}

function buildDescription(parts: Array<string | undefined>) {
  return parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" — ");
}

function rowToHeaderMap(row: Record<string, unknown>): Record<string, unknown> {
  const entries: Array<[string, unknown]> = [];
  const headerCounts = new Map<string, number>();

  for (const [key, value] of Object.entries(row)) {
    const normalized = normalizeHeader(key);
    if (!normalized) continue;

    const count = headerCounts.get(normalized) ?? 0;
    headerCounts.set(normalized, count + 1);
    const mapKey = count === 0 ? normalized : `${normalized}_${count}`;
    const stored =
      typeof value === "string" ? value.trim() : value ?? "";
    entries.push([mapKey, stored]);
  }

  return Object.fromEntries(entries);
}

function isSummaryLabel(value: string) {
  const normalized = normalizeHeader(value);
  return (
    normalized.startsWith("total") ||
    normalized === "entradas" ||
    normalized === "saldo" ||
    normalized === "despesas" ||
    normalized === "empresa"
  );
}

function buildRowRecord(
  headers: string[],
  row: unknown[],
): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  const headerCounts = new Map<string, number>();

  headers.forEach((header, columnIndex) => {
    const trimmedHeader = header.trim();
    if (!trimmedHeader) return;

    const normalized = normalizeHeader(trimmedHeader);
    const count = headerCounts.get(normalized) ?? 0;
    headerCounts.set(normalized, count + 1);
    const key = count === 0 ? trimmedHeader : `${trimmedHeader}_${count}`;
    record[key] = row[columnIndex];
  });

  return record;
}

function isHeaderRow(row: unknown[]) {
  const normalized = row.map((cell) => normalizeHeader(String(cell ?? "")));
  const hasDescriptionColumn = normalized.some(
    (cell) =>
      cell === "descricao" ||
      cell === "despesas" ||
      cell === "despesa",
  );
  const hasAmountColumn = normalized.some((cell) => cell === "valor");
  return hasDescriptionColumn && hasAmountColumn;
}

function isDualColumnHeaderRow(row: unknown[]) {
  const normalized = row.map((cell) => normalizeHeader(String(cell ?? "")));
  return (
    normalized.includes("despesas") &&
    normalized.includes("empresa") &&
    normalized.filter((cell) => cell === "valor").length >= 2
  );
}

export function mapRowToFinanceTransaction(
  row: Record<string, unknown>,
): ImportFinanceTransactionInput | null {
  const map = rowToHeaderMap(row);

  const descriptionLabel = pickValue(
    map,
    "descricao",
    "descrição",
    "despesas",
    "despesa",
  );
  const categoryName = pickValue(
    map,
    "categoria",
    "category",
  );

  if (!descriptionLabel && !categoryName) return null;
  if (descriptionLabel && isSummaryLabel(descriptionLabel)) return null;

  const isGroupedFormat = Boolean(
    pickValue(map, "categoria", "category") &&
      pickValue(map, "descricao", "descrição", "despesas", "despesa"),
  );

  const amount =
    parseAmount(map.valor_1) ??
    parseAmount(map.valor) ??
    parseAmount(map.value);
  if (amount === null) return null;

  const dueDate =
    parseExcelDate(map.venc) ??
    parseExcelDate(map.vencimento) ??
    parseExcelDate(map.venc_);

  const date =
    parseExcelDate(map.data) ??
    parseExcelDate(map.date) ??
    dueDate;
  if (!date) return null;

  const companyName = pickValue(map, "empresa", "company", "cliente");
  const managerName = pickValue(map, "gestor", "manager", "responsavel", "responsável");
  const serviceName = pickValue(map, "servico", "serviço", "service");
  const reference = pickValue(map, "ref", "referencia", "referência");
  const status = parseStatus(
    pickValue(map, "status_1", "status", "situacao", "situação"),
  );
  const type = parseTransactionType(pickValue(map, "tipo", "type"));

  const resolvedCategoryName = isGroupedFormat
    ? categoryName
    : categoryName ?? descriptionLabel;
  const description = isGroupedFormat
    ? descriptionLabel || resolvedCategoryName || ""
    : buildDescription([serviceName, companyName, managerName, reference]) ||
      descriptionLabel ||
      resolvedCategoryName ||
      "";

  if (!resolvedCategoryName || !description) return null;

  return {
    categoryName: resolvedCategoryName,
    description,
    amount,
    date,
    dueDate: dueDate ?? undefined,
    status,
    type,
    companyName,
    managerName,
    serviceName,
    reference,
  };
}

function mapDualColumnRow(row: unknown[]): ImportFinanceTransactionInput[] {
  const results: ImportFinanceTransactionInput[] = [];

  const expenseDescription = String(row[0] ?? "").trim();
  const expenseAmount = parseAmount(row[1]);
  const expenseDueDate = parseExcelDate(row[2]);
  const expenseReference = String(row[3] ?? "").trim();
  const expenseStatus = parseStatus(String(row[4] ?? ""));

  if (
    expenseDescription &&
    !isSummaryLabel(expenseDescription) &&
    expenseAmount !== null
  ) {
    results.push({
      categoryName: "DESPESA",
      description: buildDescription([expenseDescription, expenseReference]),
      amount: expenseAmount,
      date: expenseDueDate ?? new Date().toISOString().slice(0, 10),
      dueDate: expenseDueDate ?? undefined,
      status: expenseStatus,
      type: "expense",
      reference: expenseReference || undefined,
    });
  }

  const companyName = String(row[6] ?? "").trim();
  const managerName = String(row[7] ?? "").trim();
  const incomeAmount = parseAmount(row[8]);
  const incomeDate = parseExcelDate(row[9]);
  const incomeStatus = parseStatus(String(row[10] ?? ""));

  if (companyName && !isSummaryLabel(companyName) && incomeAmount !== null) {
    results.push({
      categoryName: "RECEITA",
      description: buildDescription([companyName, managerName]),
      amount: incomeAmount,
      date: incomeDate ?? incomeDueDateFallback(expenseDueDate),
      dueDate: incomeDate ?? undefined,
      status: incomeStatus,
      type: "income",
      companyName,
      managerName: managerName || undefined,
    });
  }

  return results;
}

function incomeDueDateFallback(expenseDueDate: string | null) {
  return expenseDueDate ?? new Date().toISOString().slice(0, 10);
}

function parseSheetMatrix(matrix: unknown[][]): ImportFinanceTransactionInput[] {
  if (matrix.length === 0) return [];

  const headerRowIndex = matrix.findIndex(
    (row) => Array.isArray(row) && (isHeaderRow(row) || isDualColumnHeaderRow(row)),
  );
  if (headerRowIndex < 0) return [];

  const headerRow = matrix[headerRowIndex] ?? [];
  const isDualColumn = isDualColumnHeaderRow(headerRow);

  if (isDualColumn) {
    const transactions: ImportFinanceTransactionInput[] = [];
    for (let rowIndex = headerRowIndex + 1; rowIndex < matrix.length; rowIndex += 1) {
      const row = matrix[rowIndex];
      if (!Array.isArray(row)) continue;
      if (isDualColumnHeaderRow(row) || isHeaderRow(row)) continue;

      const hasContent = row.some((cell) => String(cell ?? "").trim().length > 0);
      if (!hasContent) continue;

      transactions.push(...mapDualColumnRow(row));
    }
    return transactions;
  }

  const headers = headerRow.map((cell) => String(cell ?? "").trim());
  const transactions: ImportFinanceTransactionInput[] = [];

  for (let rowIndex = headerRowIndex + 1; rowIndex < matrix.length; rowIndex += 1) {
    const row = matrix[rowIndex];
    if (!Array.isArray(row)) continue;
    if (isHeaderRow(row)) continue;

    const hasContent = row.some((cell) => String(cell ?? "").trim().length > 0);
    if (!hasContent) continue;

    const record = buildRowRecord(headers, row);
    const mapped = mapRowToFinanceTransaction(record);
    if (mapped) transactions.push(mapped);
  }

  return transactions;
}

export function parseFinanceWorkbook(
  workbook: XLSX.WorkBook,
): ImportFinanceTransactionInput[] {
  const sheets = workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return null;

    const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: "",
    });

    return { sheetName, matrix };
  }).filter(
    (sheet): sheet is { sheetName: string; matrix: unknown[][] } =>
      sheet !== null,
  );

  const hasCategorizedSheet = sheets.some(({ matrix }) =>
    matrix.some(
      (row) =>
        Array.isArray(row) &&
        row.some((cell) => normalizeHeader(String(cell ?? "")) === "categoria"),
    ),
  );

  const transactions: ImportFinanceTransactionInput[] = [];

  for (const { matrix } of sheets) {
    const isCategorizedSheet = matrix.some(
      (row) =>
        Array.isArray(row) &&
        row.some((cell) => normalizeHeader(String(cell ?? "")) === "categoria"),
    );

    if (hasCategorizedSheet && !isCategorizedSheet) {
      continue;
    }

    transactions.push(...parseSheetMatrix(matrix));
  }

  return transactions;
}

export function readFinanceTransactionsFromArrayBuffer(
  data: ArrayBuffer,
): ImportFinanceTransactionInput[] {
  const workbook = XLSX.read(data, { type: "array", cellDates: true });
  return parseFinanceWorkbook(workbook);
}
