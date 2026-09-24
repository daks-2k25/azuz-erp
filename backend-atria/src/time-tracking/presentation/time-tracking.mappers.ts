import { clockTimeToMinutes, minutesToClockTime } from '../domain/clock-time';
import type { EmployeeProfileWithDetails } from '../domain/employee-profile';
import { calendarDateToWorkDate } from '../domain/work-date';
import {
  expectedWeeklyWorkMinutes,
  expectedWorkMinutes,
  type IsoWeekday,
  WEEKDAY_LABELS,
  type WorkSchedule,
  type WorkScheduleDay,
} from '../domain/work-schedule';
import type { WorkScheduleDayDto } from './dto/work-schedule.dto';

// ---------- Entrada (DTO -> domínio) ----------

export function toWorkScheduleDays(
  dtos: WorkScheduleDayDto[],
): WorkScheduleDay[] {
  return dtos.map((dto) => ({
    weekday: dto.weekday as IsoWeekday,
    startMinutes: clockTimeToMinutes(dto.start),
    breakStartMinutes: clockTimeToMinutes(dto.breakStart),
    breakEndMinutes: clockTimeToMinutes(dto.breakEnd),
    endMinutes: clockTimeToMinutes(dto.end),
  }));
}

/** "AAAA-MM-DD" -> Date à meia-noite UTC (coluna DATE, sem fuso). */
export function parseCalendarDate(value: string): Date {
  return calendarDateToWorkDate(value);
}

// ---------- Saída (domínio -> resposta da API) ----------

export function toWorkScheduleResponse(workSchedule: WorkSchedule) {
  return {
    id: workSchedule.id,
    name: workSchedule.name,
    reminderToleranceMinutes: workSchedule.reminderToleranceMinutes,
    isActive: workSchedule.isActive,
    weeklyWorkMinutes: expectedWeeklyWorkMinutes(workSchedule.days),
    days: workSchedule.days.map(toWorkScheduleDayResponse),
  };
}

function toWorkScheduleDayResponse(day: WorkScheduleDay) {
  return {
    weekday: day.weekday,
    weekdayLabel: WEEKDAY_LABELS[day.weekday],
    start: minutesToClockTime(day.startMinutes),
    breakStart: minutesToClockTime(day.breakStartMinutes),
    breakEnd: minutesToClockTime(day.breakEndMinutes),
    end: minutesToClockTime(day.endMinutes),
    workMinutes: expectedWorkMinutes(day),
  };
}

export function toEmployeeProfileResponse(profile: EmployeeProfileWithDetails) {
  return {
    id: profile.id,
    userId: profile.userId,
    user: profile.user,
    employmentType: profile.employmentType,
    admissionDate: formatCalendarDate(profile.admissionDate),
    workSchedule: profile.workSchedule,
    isActive: profile.isActive,
  };
}

function formatCalendarDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
