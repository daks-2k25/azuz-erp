import { KanbanTaskPriority } from '@prisma/client';
export declare const DEFAULT_SLA_SETTINGS: {
    readonly slaResponseCriticalHours: 1;
    readonly slaResponseHighHours: 4;
    readonly slaResponseMediumHours: 8;
    readonly slaResponseLowHours: 24;
    readonly slaResponsePlannedHours: 48;
    readonly slaResolutionCriticalHours: 4;
    readonly slaResolutionHighHours: 24;
    readonly slaResolutionMediumHours: 72;
    readonly slaResolutionLowHours: 168;
    readonly slaResolutionPlannedHours: 336;
};
export type SlaUiStatus = 'not_tracked' | 'ok' | 'approaching_response' | 'response_breached' | 'approaching_resolution' | 'resolution_breached' | 'met';
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
export declare function computeSlaDueDates(priority: KanbanTaskPriority, createdAt: Date, settings: SlaSettingsResponse): SlaDueDates;
export declare function computeSlaStatus(input: {
    createdAt?: Date | null;
    slaResponseDueAt: Date | null;
    slaResolutionDueAt: Date | null;
    firstResponseAt: Date | null;
    resolvedAt: Date | null;
    isDone?: boolean;
}): SlaUiStatus;
export declare function toSlaSettingsResponse(settings: {
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
}): SlaSettingsResponse;
