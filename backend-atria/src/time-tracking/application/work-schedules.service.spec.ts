import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import type {
  IsoWeekday,
  WorkSchedule,
  WorkScheduleDay,
} from '../domain/work-schedule';
import {
  CreateWorkScheduleData,
  UpdateWorkScheduleData,
  WorkScheduleRepository,
} from './ports/work-schedule.repository';
import { WorkSchedulesService } from './work-schedules.service';

const COMPANY_ID = 'company-1';
const OTHER_COMPANY_ID = 'company-2';

class InMemoryWorkScheduleRepository extends WorkScheduleRepository {
  readonly schedules: WorkSchedule[] = [];
  activeEmployeesBySchedule = new Map<string, number>();

  listByCompany(companyId: string) {
    return Promise.resolve(
      this.schedules.filter((schedule) => schedule.companyId === companyId),
    );
  }

  findById(companyId: string, workScheduleId: string) {
    const found = this.schedules.find(
      (schedule) =>
        schedule.id === workScheduleId && schedule.companyId === companyId,
    );
    return Promise.resolve(found ?? null);
  }

  existsWithName(companyId: string, name: string, ignoreId?: string) {
    return Promise.resolve(
      this.schedules.some(
        (schedule) =>
          schedule.companyId === companyId &&
          schedule.name.toLowerCase() === name.toLowerCase() &&
          schedule.id !== ignoreId,
      ),
    );
  }

  countActiveEmployees(workScheduleId: string) {
    return Promise.resolve(
      this.activeEmployeesBySchedule.get(workScheduleId) ?? 0,
    );
  }

  create(data: CreateWorkScheduleData) {
    const schedule: WorkSchedule = {
      id: `schedule-${this.schedules.length + 1}`,
      isActive: true,
      ...data,
    };
    this.schedules.push(schedule);
    return Promise.resolve(schedule);
  }

  update(workScheduleId: string, data: UpdateWorkScheduleData) {
    const schedule = this.schedules.find((item) => item.id === workScheduleId);
    if (!schedule) throw new Error('not found');
    Object.assign(
      schedule,
      Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      ),
    );
    return Promise.resolve(schedule);
  }
}

function companyDay(weekday: IsoWeekday): WorkScheduleDay {
  return {
    weekday,
    startMinutes: 480,
    breakStartMinutes: 780,
    breakEndMinutes: 840,
    endMinutes: 1140,
  };
}

const MONDAY_TO_THURSDAY = ([1, 2, 3, 4] as IsoWeekday[]).map(companyDay);

describe('WorkSchedulesService', () => {
  let repository: InMemoryWorkScheduleRepository;
  let service: WorkSchedulesService;

  beforeEach(() => {
    repository = new InMemoryWorkScheduleRepository();
    service = new WorkSchedulesService(repository);
  });

  it('cria a jornada com tolerância padrão de 15 minutos', async () => {
    const schedule = await service.create(COMPANY_ID, {
      name: '  Seg a Qui 08-19  ',
      days: MONDAY_TO_THURSDAY,
    });

    expect(schedule.name).toBe('Seg a Qui 08-19');
    expect(schedule.reminderToleranceMinutes).toBe(15);
    expect(schedule.days).toHaveLength(4);
  });

  it('não permite duas jornadas com o mesmo nome na empresa', async () => {
    await service.create(COMPANY_ID, {
      name: 'Comercial',
      days: MONDAY_TO_THURSDAY,
    });

    await expect(
      service.create(COMPANY_ID, {
        name: 'comercial',
        days: MONDAY_TO_THURSDAY,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('transforma regra de domínio inválida em erro 400', async () => {
    await expect(
      service.create(COMPANY_ID, { name: 'Vazia', days: [] }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('não enxerga jornada de outra empresa', async () => {
    const schedule = await service.create(OTHER_COMPANY_ID, {
      name: 'Outra',
      days: MONDAY_TO_THURSDAY,
    });

    await expect(
      service.getById(COMPANY_ID, schedule.id),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('não desativa jornada usada por funcionários ativos', async () => {
    const schedule = await service.create(COMPANY_ID, {
      name: 'Comercial',
      days: MONDAY_TO_THURSDAY,
    });
    repository.activeEmployeesBySchedule.set(schedule.id, 2);

    await expect(
      service.deactivate(COMPANY_ID, schedule.id),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('desativa jornada sem funcionários e bloqueia seu uso', async () => {
    const schedule = await service.create(COMPANY_ID, {
      name: 'Comercial',
      days: MONDAY_TO_THURSDAY,
    });

    await service.deactivate(COMPANY_ID, schedule.id);

    await expect(
      service.getActiveById(COMPANY_ID, schedule.id),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
