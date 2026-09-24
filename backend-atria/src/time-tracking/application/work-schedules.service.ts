import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  assertValidReminderTolerance,
  assertValidWorkScheduleDays,
  DEFAULT_REMINDER_TOLERANCE_MINUTES,
  InvalidWorkScheduleError,
  type WorkSchedule,
  type WorkScheduleDay,
} from '../domain/work-schedule';
import { WorkScheduleRepository } from './ports/work-schedule.repository';

export interface CreateWorkScheduleInput {
  name: string;
  reminderToleranceMinutes?: number;
  days: WorkScheduleDay[];
}

export interface UpdateWorkScheduleInput {
  name?: string;
  reminderToleranceMinutes?: number;
  days?: WorkScheduleDay[];
}

@Injectable()
export class WorkSchedulesService {
  constructor(private readonly workSchedules: WorkScheduleRepository) {}

  list(companyId: string): Promise<WorkSchedule[]> {
    return this.workSchedules.listByCompany(companyId);
  }

  async getById(
    companyId: string,
    workScheduleId: string,
  ): Promise<WorkSchedule> {
    const workSchedule = await this.workSchedules.findById(
      companyId,
      workScheduleId,
    );
    if (!workSchedule) {
      throw new NotFoundException('Jornada não encontrada.');
    }
    return workSchedule;
  }

  async getActiveById(
    companyId: string,
    workScheduleId: string,
  ): Promise<WorkSchedule> {
    const workSchedule = await this.getById(companyId, workScheduleId);
    if (!workSchedule.isActive) {
      throw new BadRequestException('A jornada selecionada está inativa.');
    }
    return workSchedule;
  }

  async create(
    companyId: string,
    input: CreateWorkScheduleInput,
  ): Promise<WorkSchedule> {
    const name = input.name.trim();
    const reminderToleranceMinutes =
      input.reminderToleranceMinutes ?? DEFAULT_REMINDER_TOLERANCE_MINUTES;

    this.validateRules(input.days, reminderToleranceMinutes);
    await this.ensureNameIsAvailable(companyId, name);

    return this.workSchedules.create({
      companyId,
      name,
      reminderToleranceMinutes,
      days: input.days,
    });
  }

  async update(
    companyId: string,
    workScheduleId: string,
    input: UpdateWorkScheduleInput,
  ): Promise<WorkSchedule> {
    const current = await this.getById(companyId, workScheduleId);
    const name = input.name?.trim();

    this.validateRules(
      input.days ?? current.days,
      input.reminderToleranceMinutes ?? current.reminderToleranceMinutes,
    );
    if (name && name !== current.name) {
      await this.ensureNameIsAvailable(companyId, name, workScheduleId);
    }

    return this.workSchedules.update(workScheduleId, {
      name,
      reminderToleranceMinutes: input.reminderToleranceMinutes,
      days: input.days,
    });
  }

  async deactivate(
    companyId: string,
    workScheduleId: string,
  ): Promise<WorkSchedule> {
    await this.getById(companyId, workScheduleId);

    const activeEmployees =
      await this.workSchedules.countActiveEmployees(workScheduleId);
    if (activeEmployees > 0) {
      throw new ConflictException(
        `Esta jornada está em uso por ${activeEmployees} funcionário(s) ativo(s). Troque a jornada deles antes de desativá-la.`,
      );
    }

    return this.workSchedules.update(workScheduleId, { isActive: false });
  }

  async activate(
    companyId: string,
    workScheduleId: string,
  ): Promise<WorkSchedule> {
    await this.getById(companyId, workScheduleId);
    return this.workSchedules.update(workScheduleId, { isActive: true });
  }

  private validateRules(
    days: WorkScheduleDay[],
    reminderToleranceMinutes: number,
  ): void {
    try {
      assertValidWorkScheduleDays(days);
      assertValidReminderTolerance(reminderToleranceMinutes);
    } catch (error) {
      if (error instanceof InvalidWorkScheduleError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  private async ensureNameIsAvailable(
    companyId: string,
    name: string,
    ignoreWorkScheduleId?: string,
  ): Promise<void> {
    const nameIsTaken = await this.workSchedules.existsWithName(
      companyId,
      name,
      ignoreWorkScheduleId,
    );
    if (nameIsTaken) {
      throw new ConflictException(`Já existe uma jornada chamada "${name}".`);
    }
  }
}
