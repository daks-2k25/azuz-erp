import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CLOCK_TIME_PATTERN } from '../../domain/clock-time';
import {
  MAX_REMINDER_TOLERANCE_MINUTES,
  MIN_REMINDER_TOLERANCE_MINUTES,
} from '../../domain/work-schedule';

const CLOCK_TIME_MESSAGE = 'Use o formato HH:mm (ex.: 08:00).';

export class WorkScheduleDayDto {
  /** 1 = segunda ... 7 = domingo */
  @IsInt()
  @Min(1)
  @Max(7)
  weekday: number;

  @Matches(CLOCK_TIME_PATTERN, { message: `start: ${CLOCK_TIME_MESSAGE}` })
  start: string;

  @Matches(CLOCK_TIME_PATTERN, { message: `breakStart: ${CLOCK_TIME_MESSAGE}` })
  breakStart: string;

  @Matches(CLOCK_TIME_PATTERN, { message: `breakEnd: ${CLOCK_TIME_MESSAGE}` })
  breakEnd: string;

  @Matches(CLOCK_TIME_PATTERN, { message: `end: ${CLOCK_TIME_MESSAGE}` })
  end: string;
}

export class CreateWorkScheduleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsInt()
  @Min(MIN_REMINDER_TOLERANCE_MINUTES)
  @Max(MAX_REMINDER_TOLERANCE_MINUTES)
  reminderToleranceMinutes?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => WorkScheduleDayDto)
  days: WorkScheduleDayDto[];
}

export class UpdateWorkScheduleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(MIN_REMINDER_TOLERANCE_MINUTES)
  @Max(MAX_REMINDER_TOLERANCE_MINUTES)
  reminderToleranceMinutes?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => WorkScheduleDayDto)
  days?: WorkScheduleDayDto[];
}
