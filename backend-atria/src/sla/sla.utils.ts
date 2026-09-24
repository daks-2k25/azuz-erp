import { KanbanTaskPriority } from '@prisma/client';

export const DEFAULT_SLA_SETTINGS = {
  slaResponseCriticalHours: 1,
  slaResponseHighHours: 4,
  slaResponseMediumHours: 8,
  slaResponseLowHours: 24,
  slaResponsePlannedHours: 48,
  slaResolutionCriticalHours: 4,
  slaResolutionHighHours: 24,
  slaResolutionMediumHours: 72,
  slaResolutionLowHours: 168,
  slaResolutionPlannedHours: 336,
} as const;

export type SlaUiStatus =
  | 'not_tracked'
  | 'ok'
  | 'approaching_response'
  | 'response_breached'
  | 'approaching_resolution'
  | 'resolution_breached'
  | 'met';

export interface SlaSettingsResponse {
  slaResponseCriticalHours: number;
  slaResponseHighHours: number;
  slaResponseMediumHours: number;
  slaResponseLowHours: number;
  slaResponsePlannedHours: number;
  slaResolutionCriticalHours: number;
  slaResolutionHighHours: number;
  slaResolutionMediumHours: number;
  slaResolutionLowHours: number;
  slaResolutionPlannedHours: number;
}

export interface SlaDueDates {
  slaResponseDueAt: Date;
  slaResolutionDueAt: Date;
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function responseHoursForPriority(
  priority: KanbanTaskPriority,
  settings: SlaSettingsResponse,
): number {
  switch (priority) {
    case KanbanTaskPriority.CRITICAL:
      return settings.slaResponseCriticalHours;
    case KanbanTaskPriority.HIGH:
      return settings.slaResponseHighHours;
    case KanbanTaskPriority.MEDIUM:
      return settings.slaResponseMediumHours;
    case KanbanTaskPriority.LOW:
      return settings.slaResponseLowHours;
    case KanbanTaskPriority.PLANNED:
      return settings.slaResponsePlannedHours;
    default:
      return settings.slaResponseMediumHours;
  }
}

function resolutionHoursForPriority(
  priority: KanbanTaskPriority,
  settings: SlaSettingsResponse,
): number {
  switch (priority) {
    case KanbanTaskPriority.CRITICAL:
      return settings.slaResolutionCriticalHours;
    case KanbanTaskPriority.HIGH:
      return settings.slaResolutionHighHours;
    case KanbanTaskPriority.MEDIUM:
      return settings.slaResolutionMediumHours;
    case KanbanTaskPriority.LOW:
      return settings.slaResolutionLowHours;
    case KanbanTaskPriority.PLANNED:
      return settings.slaResolutionPlannedHours;
    default:
      return settings.slaResolutionMediumHours;
  }
}

export function computeSlaDueDates(
  priority: KanbanTaskPriority,
  createdAt: Date,
  settings: SlaSettingsResponse,
): SlaDueDates {
  const responseHours = responseHoursForPriority(priority, settings);
  const resolutionHours = resolutionHoursForPriority(priority, settings);
  return {
    slaResponseDueAt: addHours(createdAt, responseHours),
    slaResolutionDueAt: addHours(createdAt, resolutionHours),
  };
}

export function computeSlaStatus(input: {
  createdAt?: Date | null;
  slaResponseDueAt: Date | null;
  slaResolutionDueAt: Date | null;
  firstResponseAt: Date | null;
  resolvedAt: Date | null;
  isDone?: boolean;
}): SlaUiStatus {
  const now = Date.now();

  if (!input.slaResponseDueAt && !input.slaResolutionDueAt) {
    return 'not_tracked';
  }

  if (input.resolvedAt) {
    if (
      input.slaResolutionDueAt &&
      input.resolvedAt.getTime() > input.slaResolutionDueAt.getTime()
    ) {
      return 'resolution_breached';
    }
    return 'met';
  }

  if (input.isDone) {
    return input.slaResolutionDueAt && now > input.slaResolutionDueAt.getTime()
      ? 'resolution_breached'
      : 'met';
  }

  if (!input.firstResponseAt && input.slaResponseDueAt) {
    const due = input.slaResponseDueAt.getTime();
    if (now > due) return 'response_breached';
    const created = input.createdAt?.getTime() ?? due - 8 * 3600000;
    const totalWindow = due - created;
    const remaining = due - now;
    if (totalWindow > 0 && remaining < totalWindow * 0.25) {
      return 'approaching_response';
    }
  }

  if (input.slaResolutionDueAt) {
    const due = input.slaResolutionDueAt.getTime();
    if (now > due) return 'resolution_breached';
    const start =
      input.firstResponseAt?.getTime() ??
      input.slaResponseDueAt?.getTime() ??
      input.createdAt?.getTime() ??
      now;
    const totalWindow = due - start;
    const remaining = due - now;
    if (totalWindow > 0 && remaining < totalWindow * 0.25) {
      return 'approaching_resolution';
    }
  }

  return 'ok';
}

export function toSlaSettingsResponse(settings: {
  slaResponseCriticalHours: number;
  slaResponseHighHours: number;
  slaResponseMediumHours: number;
  slaResponseLowHours: number;
  slaResponsePlannedHours: number;
  slaResolutionCriticalHours: number;
  slaResolutionHighHours: number;
  slaResolutionMediumHours: number;
  slaResolutionLowHours: number;
  slaResolutionPlannedHours: number;
}): SlaSettingsResponse {
  return {
    slaResponseCriticalHours: settings.slaResponseCriticalHours,
    slaResponseHighHours: settings.slaResponseHighHours,
    slaResponseMediumHours: settings.slaResponseMediumHours,
    slaResponseLowHours: settings.slaResponseLowHours,
    slaResponsePlannedHours: settings.slaResponsePlannedHours,
    slaResolutionCriticalHours: settings.slaResolutionCriticalHours,
    slaResolutionHighHours: settings.slaResolutionHighHours,
    slaResolutionMediumHours: settings.slaResolutionMediumHours,
    slaResolutionLowHours: settings.slaResolutionLowHours,
    slaResolutionPlannedHours: settings.slaResolutionPlannedHours,
  };
}
