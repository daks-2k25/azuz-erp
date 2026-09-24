import { Injectable } from '@nestjs/common';
import { Prisma, TimeClockEntryType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ClockReminderRepository,
  ReminderCandidate,
} from '../application/ports/clock-reminder.repository';
import { toWorkScheduleDay } from './work-schedule-day.mapper';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

@Injectable()
export class PrismaClockReminderRepository extends ClockReminderRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async listActiveCandidates(): Promise<ReminderCandidate[]> {
    const profiles = await this.prisma.employeeProfile.findMany({
      where: {
        isActive: true,
        user: { isActive: true },
        workSchedule: { isActive: true },
      },
      select: {
        id: true,
        userId: true,
        companyId: true,
        workSchedule: {
          select: {
            reminderToleranceMinutes: true,
            days: true,
          },
        },
      },
    });

    return profiles.map((profile) => ({
      employeeProfileId: profile.id,
      userId: profile.userId,
      companyId: profile.companyId,
      toleranceMinutes: profile.workSchedule.reminderToleranceMinutes,
      scheduleDays: profile.workSchedule.days.map(toWorkScheduleDay),
    }));
  }

  async tryRecordReminder(
    employeeProfileId: string,
    workDate: Date,
    entryType: TimeClockEntryType,
  ): Promise<boolean> {
    try {
      await this.prisma.timeClockReminder.create({
        data: { employeeProfileId, workDate, entryType },
      });
      return true;
    } catch (error) {
      if (isUniqueConstraintViolation(error)) return false;
      throw error;
    }
  }
}

function isUniqueConstraintViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === UNIQUE_CONSTRAINT_VIOLATION
  );
}
