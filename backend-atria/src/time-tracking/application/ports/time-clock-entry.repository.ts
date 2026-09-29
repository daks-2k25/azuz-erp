import type { TimeClockEntryType } from '@prisma/client';
import type { TimeClockEntry } from '../../domain/time-clock-entry';

export interface AppendEntryData {
  companyId: string;
  employeeProfileId: string;
  workDate: Date;
  recordedAt: Date;
}

/**
 * Decide o tipo da nova marcação a partir das marcações do dia.
 * Deve lançar erro quando a marcação não for permitida.
 */
export type EntryTypeDecider = (
  entriesOfDay: TimeClockEntry[],
) => TimeClockEntryType;

/** Porta de persistência das marcações. A implementação fica na infraestrutura. */
export abstract class TimeClockEntryRepository {
  /** Marcações válidas do dia (exclui as substituídas por ajuste aprovado), em ordem. */
  abstract listEffectiveEntries(
    employeeProfileId: string,
    workDate: Date,
  ): Promise<TimeClockEntry[]>;

  /**
   * Registra uma marcação de forma atômica: bloqueia registros simultâneos
   * da mesma empresa, relê as marcações do dia, chama `decideEntryType`
   * e grava com o próximo número sequencial (NSR).
   */
  abstract append(
    data: AppendEntryData,
    decideEntryType: EntryTypeDecider,
  ): Promise<TimeClockEntry>;
}
