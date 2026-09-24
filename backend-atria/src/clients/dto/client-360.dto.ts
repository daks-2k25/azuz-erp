import { IsEnum, IsOptional } from 'class-validator';

export enum Client360Section {
  SUMMARY = 'summary',
  PIPELINE = 'pipeline',
  FINANCIAL = 'financial',
  CALENDAR = 'calendar',
  ASSETS = 'assets',
  TASKS = 'tasks',
}

export class QueryClient360Dto {
  @IsOptional()
  @IsEnum(Client360Section)
  section?: Client360Section;
}
