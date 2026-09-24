import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { WorkSchedule, WorkScheduleDay } from '../domain/work-schedule';
import {
  CreateWorkScheduleData,
  UpdateWorkScheduleData,
  WorkScheduleRepository,
} from '../application/ports/work-schedule.repository';
import { toWorkScheduleDay } from './work-schedule-day.mapper';

const WORK_SCHEDULE_INCLUDE = {
  days: { orderBy: { weekday: 'asc' } },
} satisfies Prisma.WorkScheduleInclude;

type WorkScheduleRecord = Prisma.WorkScheduleGetPayload<{
  include: typeof WORK_SCHEDULE_INCLUDE;
}>;

@Injectable()
export class PrismaWorkScheduleRepository extends WorkScheduleRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async listByCompany(companyId: string): Promise<WorkSchedule[]> {
    const records = await this.prisma.workSchedule.findMany({
      where: { companyId },
      include: WORK_SCHEDULE_INCLUDE,
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });
    return records.map(toWorkSchedule);
  }

  async findById(
    companyId: string,
    workScheduleId: string,
  ): Promise<WorkSchedule | null> {
    const record = await this.prisma.workSchedule.findFirst({
      where: { id: workScheduleId, companyId },
      include: WORK_SCHEDULE_INCLUDE,
    });
    return record ? toWorkSchedule(record) : null;
  }

  async existsWithName(
    companyId: string,
    name: string,
    ignoreWorkScheduleId?: string,
  ): Promise<boolean> {
    const count = await this.prisma.workSchedule.count({
      where: {
        companyId,
        name: { equals: name, mode: 'insensitive' },
        ...(ignoreWorkScheduleId ? { id: { not: ignoreWorkScheduleId } } : {}),
      },
    });
    return count > 0;
  }

  countActiveEmployees(workScheduleId: string): Promise<number> {
    return this.prisma.employeeProfile.count({
      where: { workScheduleId, isActive: true },
    });
  }

  async create(data: CreateWorkScheduleData): Promise<WorkSchedule> {
    const record = await this.prisma.workSchedule.create({
      data: {
        companyId: data.companyId,
        name: data.name,
        reminderToleranceMinutes: data.reminderToleranceMinutes,
        days: { create: data.days.map(toDayCreateInput) },
      },
      include: WORK_SCHEDULE_INCLUDE,
    });
    return toWorkSchedule(record);
  }

  async update(
    workScheduleId: string,
    data: UpdateWorkScheduleData,
  ): Promise<WorkSchedule> {
    const record = await this.prisma.$transaction(async (transaction) => {
      if (data.days) {
        await transaction.workScheduleDay.deleteMany({
          where: { workScheduleId },
        });
      }

      return transaction.workSchedule.update({
        where: { id: workScheduleId },
        data: {
          name: data.name,
          reminderToleranceMinutes: data.reminderToleranceMinutes,
          isActive: data.isActive,
          ...(data.days
            ? { days: { create: data.days.map(toDayCreateInput) } }
            : {}),
        },
        include: WORK_SCHEDULE_INCLUDE,
      });
    });
    return toWorkSchedule(record);
  }
}

function toDayCreateInput(
  day: WorkScheduleDay,
): Prisma.WorkScheduleDayCreateWithoutWorkScheduleInput {
  return {
    weekday: day.weekday,
    startMinutes: day.startMinutes,
    breakStartMinutes: day.breakStartMinutes,
    breakEndMinutes: day.breakEndMinutes,
    endMinutes: day.endMinutes,
  };
}

function toWorkSchedule(record: WorkScheduleRecord): WorkSchedule {
  return {
    id: record.id,
    companyId: record.companyId,
    name: record.name,
    reminderToleranceMinutes: record.reminderToleranceMinutes,
    isActive: record.isActive,
    days: record.days.map(toWorkScheduleDay),
  };
}
