import type { TimeClockEntryType } from '@prisma/client';
import type { WorkScheduleDay } from '../../domain/work-schedule';

/** Funcionário CLT ativo que pode receber lembrete, com a jornada dele. */
export interface ReminderCandidate {
  employeeProfileId: string;
  userId: string;
  companyId: string;
  toleranceMinutes: number;
  scheduleDays: WorkScheduleDay[];
}

/** Porta de persistência dos lembretes. A implementação fica na infraestrutura. */
export abstract class ClockReminderRepository {
  abstract listActiveCandidates(): Promise<ReminderCandidate[]>;

  /**
   * Registra que o lembrete foi enviado. Retorna false se ele já tinha sido
   * registrado antes (garante um lembrete por marcação por dia).
   */
  abstract tryRecordReminder(
    employeeProfileId: string,
    workDate: Date,
    entryType: TimeClockEntryType,
  ): Promise<boolean>;
}
