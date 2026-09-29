import { TimeClockEntryOrigin, TimeClockEntryType } from '@prisma/client';

/** Ordem obrigatória das marcações de um dia. */
export const DAILY_ENTRY_SEQUENCE: readonly TimeClockEntryType[] = [
  TimeClockEntryType.CLOCK_IN,
  TimeClockEntryType.BREAK_START,
  TimeClockEntryType.BREAK_END,
  TimeClockEntryType.CLOCK_OUT,
];

export const ENTRY_TYPE_LABELS: Record<TimeClockEntryType, string> = {
  CLOCK_IN: 'Entrada',
  BREAK_START: 'Saída para almoço',
  BREAK_END: 'Volta do almoço',
  CLOCK_OUT: 'Saída',
};

export interface TimeClockEntry {
  id: string;
  companyId: string;
  employeeProfileId: string;
  sequenceNumber: bigint;
  entryType: TimeClockEntryType;
  /** Data do dia de trabalho (meia-noite UTC, coluna DATE). */
  workDate: Date;
  recordedAt: Date;
  origin: TimeClockEntryOrigin;
}

export class InvalidTimeClockEntryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = InvalidTimeClockEntryError.name;
  }
}

/** Intervalo mínimo entre duas marcações, para evitar clique duplo. */
export const MIN_SECONDS_BETWEEN_ENTRIES = 60;

/**
 * Próxima marcação esperada, a partir das marcações já feitas no dia.
 * Retorna null quando o dia já está completo.
 */
export function nextEntryType(
  entriesOfDay: Pick<TimeClockEntry, 'entryType'>[],
): TimeClockEntryType | null {
  return DAILY_ENTRY_SEQUENCE[entriesOfDay.length] ?? null;
}

/**
 * Decide o tipo da nova marcação e aplica as regras de registro.
 * Lança InvalidTimeClockEntryError quando a marcação não é permitida.
 */
export function decideNewEntryType(
  entriesOfDay: Pick<TimeClockEntry, 'entryType' | 'recordedAt'>[],
  now: Date,
): TimeClockEntryType {
  const entryType = nextEntryType(entriesOfDay);
  if (!entryType) {
    throw new InvalidTimeClockEntryError(
      'Você já registrou todas as marcações de hoje.',
    );
  }

  const lastEntry = entriesOfDay.at(-1);
  if (
    lastEntry &&
    secondsBetween(lastEntry.recordedAt, now) < MIN_SECONDS_BETWEEN_ENTRIES
  ) {
    throw new InvalidTimeClockEntryError(
      'Sua última marcação foi registrada há instantes. Aguarde 1 minuto para registrar a próxima.',
    );
  }

  return entryType;
}

/**
 * Minutos trabalhados no dia: (entrada → saída almoço) + (volta almoço → saída).
 * Um período ainda aberto conta até `now`.
 */
export function workedMinutes(
  entriesOfDay: Pick<TimeClockEntry, 'entryType' | 'recordedAt'>[],
  now: Date,
): number {
  const timeOf = (type: TimeClockEntryType) =>
    entriesOfDay.find((entry) => entry.entryType === type)?.recordedAt;

  const morning = minutesBetween(
    timeOf(TimeClockEntryType.CLOCK_IN),
    timeOf(TimeClockEntryType.BREAK_START) ?? now,
  );
  const afternoon = minutesBetween(
    timeOf(TimeClockEntryType.BREAK_END),
    timeOf(TimeClockEntryType.CLOCK_OUT) ?? now,
  );

  return morning + afternoon;
}

function minutesBetween(start: Date | undefined, end: Date): number {
  if (!start) return 0;
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60_000));
}

function secondsBetween(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / 1000;
}
