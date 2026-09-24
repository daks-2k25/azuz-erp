import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { EmployeeProfileWithDetails } from '../domain/employee-profile';
import { EmployeeProfileRepository } from './ports/employee-profile.repository';
import { WorkSchedulesService } from './work-schedules.service';

export interface CreateEmployeeProfileInput {
  userId: string;
  admissionDate: Date;
  workScheduleId: string;
}

export interface UpdateEmployeeProfileInput {
  admissionDate?: Date;
  workScheduleId?: string;
}

@Injectable()
export class EmployeeProfilesService {
  constructor(
    private readonly employeeProfiles: EmployeeProfileRepository,
    private readonly workSchedules: WorkSchedulesService,
  ) {}

  list(companyId: string): Promise<EmployeeProfileWithDetails[]> {
    return this.employeeProfiles.listByCompany(companyId);
  }

  /** Retorna o cadastro CLT do próprio usuário, ou null se ele não bate ponto. */
  findForUser(userId: string): Promise<EmployeeProfileWithDetails | null> {
    return this.employeeProfiles.findByUserId(userId);
  }

  async create(
    companyId: string,
    input: CreateEmployeeProfileInput,
  ): Promise<EmployeeProfileWithDetails> {
    await this.ensureUserIsEligible(companyId, input.userId);
    await this.ensureUserHasNoProfile(input.userId);
    await this.workSchedules.getActiveById(companyId, input.workScheduleId);

    return this.employeeProfiles.create({
      companyId,
      userId: input.userId,
      admissionDate: input.admissionDate,
      workScheduleId: input.workScheduleId,
    });
  }

  async update(
    companyId: string,
    employeeProfileId: string,
    input: UpdateEmployeeProfileInput,
  ): Promise<EmployeeProfileWithDetails> {
    await this.getById(companyId, employeeProfileId);
    if (input.workScheduleId) {
      await this.workSchedules.getActiveById(companyId, input.workScheduleId);
    }

    return this.employeeProfiles.update(employeeProfileId, input);
  }

  async deactivate(
    companyId: string,
    employeeProfileId: string,
  ): Promise<EmployeeProfileWithDetails> {
    await this.getById(companyId, employeeProfileId);
    return this.employeeProfiles.update(employeeProfileId, { isActive: false });
  }

  async activate(
    companyId: string,
    employeeProfileId: string,
  ): Promise<EmployeeProfileWithDetails> {
    const profile = await this.getById(companyId, employeeProfileId);
    await this.workSchedules.getActiveById(companyId, profile.workScheduleId);
    return this.employeeProfiles.update(employeeProfileId, { isActive: true });
  }

  private async getById(
    companyId: string,
    employeeProfileId: string,
  ): Promise<EmployeeProfileWithDetails> {
    const profile = await this.employeeProfiles.findById(
      companyId,
      employeeProfileId,
    );
    if (!profile) {
      throw new NotFoundException('Cadastro de funcionário não encontrado.');
    }
    return profile;
  }

  private async ensureUserIsEligible(
    companyId: string,
    userId: string,
  ): Promise<void> {
    const user = await this.employeeProfiles.findEligibleUser(userId);
    if (!user || user.companyId !== companyId) {
      throw new NotFoundException('Usuário não encontrado nesta empresa.');
    }
    if (!user.isActive) {
      throw new BadRequestException('O usuário está desativado.');
    }
    if (!user.isInternalMember) {
      throw new BadRequestException(
        'Somente usuários da equipe interna podem ser cadastrados como CLT.',
      );
    }
  }

  private async ensureUserHasNoProfile(userId: string): Promise<void> {
    const existing = await this.employeeProfiles.findByUserId(userId);
    if (existing) {
      throw new ConflictException(
        'Este usuário já possui cadastro de funcionário CLT.',
      );
    }
  }
}
