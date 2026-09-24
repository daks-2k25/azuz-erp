import { ClientBriefStatus, KanbanTaskPriority } from '@prisma/client';
export declare class UpdateSlaSettingsDto {
    slaResponseCriticalHours?: number;
    slaResponseHighHours?: number;
    slaResponseMediumHours?: number;
    slaResponseLowHours?: number;
    slaResponsePlannedHours?: number;
    slaResolutionCriticalHours?: number;
    slaResolutionHighHours?: number;
    slaResolutionMediumHours?: number;
    slaResolutionLowHours?: number;
    slaResolutionPlannedHours?: number;
}
export declare class UpdateClientBriefSlaDto {
    status?: ClientBriefStatus;
    priority?: KanbanTaskPriority;
    assignedToId?: string | null;
}
