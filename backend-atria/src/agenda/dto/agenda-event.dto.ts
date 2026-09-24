import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateAgendaEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  eventDate: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  startTime?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  endTime?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  eventType: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  recurrence?: string;

  @IsArray()
  @IsOptional()
  participants?: unknown[];

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  meetingLink?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  priority?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;
}

export class UpdateAgendaEventDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  eventDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  startTime?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  endTime?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  eventType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  recurrence?: string;

  @IsArray()
  @IsOptional()
  participants?: unknown[];

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  meetingLink?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  priority?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;
}

export class QueryAgendaEventsDto {
  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  to?: string;
}

export class ConfirmAgendaEventDto {
  @IsUUID()
  userId: string;
}
