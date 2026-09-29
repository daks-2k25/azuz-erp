import type { WorkScheduleDay as WorkScheduleDayRecord } from '@prisma/client';
import { type WorkScheduleDay } from '../domain/work-schedule';
export declare function toWorkScheduleDay(record: Pick<WorkScheduleDayRecord, 'weekday' | 'startMinutes' | 'breakStartMinutes' | 'breakEndMinutes' | 'endMinutes'>): WorkScheduleDay;
