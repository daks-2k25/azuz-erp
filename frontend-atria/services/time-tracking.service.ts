import { apiRequest } from "./api";

/** 1 = segunda ... 7 = domingo */
export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface WorkScheduleDay {
  weekday: IsoWeekday;
  weekdayLabel: string;
  /** Horários no formato "HH:mm" */
  start: string;
  breakStart: string;
  breakEnd: string;
  end: string;
  workMinutes: number;
}

export interface WorkSchedule {
  id: string;
  name: string;
  reminderToleranceMinutes: number;
  isActive: boolean;
  weeklyWorkMinutes: number;
  days: WorkScheduleDay[];
}

export interface WorkScheduleDayInput {
  weekday: IsoWeekday;
  start: string;
  breakStart: string;
  breakEnd: string;
  end: string;
}

export interface WorkScheduleInput {
  name: string;
  reminderToleranceMinutes: number;
  days: WorkScheduleDayInput[];
}

export interface EmployeeProfile {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string; avatarUrl: string | null };
  employmentType: "CLT";
  /** "AAAA-MM-DD" */
  admissionDate: string;
  workSchedule: { id: string; name: string };
  isActive: boolean;
}

export interface CreateEmployeeProfileInput {
  userId: string;
  admissionDate: string;
  workScheduleId: string;
}

export interface UpdateEmployeeProfileInput {
  admissionDate?: string;
  workScheduleId?: string;
}

const BASE = "/time-tracking";

// ---------- Jornadas ----------

export function getWorkSchedules(): Promise<WorkSchedule[]> {
  return apiRequest<WorkSchedule[]>(`${BASE}/work-schedules`);
}

export function createWorkSchedule(
  data: WorkScheduleInput,
): Promise<WorkSchedule> {
  return apiRequest<WorkSchedule>(`${BASE}/work-schedules`, {
    method: "POST",
    body: data,
  });
}

export function updateWorkSchedule(
  id: string,
  data: WorkScheduleInput,
): Promise<WorkSchedule> {
  return apiRequest<WorkSchedule>(`${BASE}/work-schedules/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export function setWorkScheduleActive(
  id: string,
  isActive: boolean,
): Promise<WorkSchedule> {
  const action = isActive ? "activate" : "deactivate";
  return apiRequest<WorkSchedule>(`${BASE}/work-schedules/${id}/${action}`, {
    method: "PATCH",
  });
}

// ---------- Funcionários CLT ----------

export function getEmployeeProfiles(): Promise<EmployeeProfile[]> {
  return apiRequest<EmployeeProfile[]>(`${BASE}/employees`);
}

export function createEmployeeProfile(
  data: CreateEmployeeProfileInput,
): Promise<EmployeeProfile> {
  return apiRequest<EmployeeProfile>(`${BASE}/employees`, {
    method: "POST",
    body: data,
  });
}

export function updateEmployeeProfile(
  id: string,
  data: UpdateEmployeeProfileInput,
): Promise<EmployeeProfile> {
  return apiRequest<EmployeeProfile>(`${BASE}/employees/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export function setEmployeeProfileActive(
  id: string,
  isActive: boolean,
): Promise<EmployeeProfile> {
  const action = isActive ? "activate" : "deactivate";
  return apiRequest<EmployeeProfile>(`${BASE}/employees/${id}/${action}`, {
    method: "PATCH",
  });
}

// ---------- Usuário logado ----------

export function getMyEmployeeProfile(): Promise<{
  profile: EmployeeProfile | null;
}> {
  return apiRequest<{ profile: EmployeeProfile | null }>(`${BASE}/me/profile`);
}

// ---------- Bater ponto ----------

export type TimeClockEntryType =
  | "CLOCK_IN"
  | "BREAK_START"
  | "BREAK_END"
  | "CLOCK_OUT";

export interface TimeClockEntry {
  id: string;
  entryType: TimeClockEntryType;
  label: string;
  recordedAt: string;
  /** Horário de Brasília "HH:mm" */
  time: string;
  /** Número sequencial do registro (NSR), com 9 dígitos */
  sequenceNumber: string;
  origin: "EMPLOYEE" | "ADJUSTMENT";
}

export interface TodayClock {
  /** "AAAA-MM-DD" */
  date: string;
  weekday: IsoWeekday;
  weekdayLabel: string;
  isWorkday: boolean;
  expected: Record<TimeClockEntryType, string> | null;
  entries: TimeClockEntry[];
  nextEntry: { entryType: TimeClockEntryType; label: string } | null;
  workedMinutes: number;
  expectedMinutes: number;
  serverTime: string;
}

export interface RegisterClockResult {
  entry: TimeClockEntry;
  today: TodayClock;
}

export function getTodayClock(): Promise<TodayClock> {
  return apiRequest<TodayClock>(`${BASE}/me/clock/today`);
}

export function registerClockEntry(): Promise<RegisterClockResult> {
  return apiRequest<RegisterClockResult>(`${BASE}/me/clock`, {
    method: "POST",
  });
}
