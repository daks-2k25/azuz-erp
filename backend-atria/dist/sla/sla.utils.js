"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SLA_SETTINGS = void 0;
exports.computeSlaDueDates = computeSlaDueDates;
exports.computeSlaStatus = computeSlaStatus;
exports.toSlaSettingsResponse = toSlaSettingsResponse;
const client_1 = require("@prisma/client");
exports.DEFAULT_SLA_SETTINGS = {
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
};
function addHours(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
function responseHoursForPriority(priority, settings) {
    switch (priority) {
        case client_1.KanbanTaskPriority.CRITICAL:
            return settings.slaResponseCriticalHours;
        case client_1.KanbanTaskPriority.HIGH:
            return settings.slaResponseHighHours;
        case client_1.KanbanTaskPriority.MEDIUM:
            return settings.slaResponseMediumHours;
        case client_1.KanbanTaskPriority.LOW:
            return settings.slaResponseLowHours;
        case client_1.KanbanTaskPriority.PLANNED:
            return settings.slaResponsePlannedHours;
        default:
            return settings.slaResponseMediumHours;
    }
}
function resolutionHoursForPriority(priority, settings) {
    switch (priority) {
        case client_1.KanbanTaskPriority.CRITICAL:
            return settings.slaResolutionCriticalHours;
        case client_1.KanbanTaskPriority.HIGH:
            return settings.slaResolutionHighHours;
        case client_1.KanbanTaskPriority.MEDIUM:
            return settings.slaResolutionMediumHours;
        case client_1.KanbanTaskPriority.LOW:
            return settings.slaResolutionLowHours;
        case client_1.KanbanTaskPriority.PLANNED:
            return settings.slaResolutionPlannedHours;
        default:
            return settings.slaResolutionMediumHours;
    }
}
function computeSlaDueDates(priority, createdAt, settings) {
    const responseHours = responseHoursForPriority(priority, settings);
    const resolutionHours = resolutionHoursForPriority(priority, settings);
    return {
        slaResponseDueAt: addHours(createdAt, responseHours),
        slaResolutionDueAt: addHours(createdAt, resolutionHours),
    };
}
function computeSlaStatus(input) {
    const now = Date.now();
    if (!input.slaResponseDueAt && !input.slaResolutionDueAt) {
        return 'not_tracked';
    }
    if (input.resolvedAt) {
        if (input.slaResolutionDueAt &&
            input.resolvedAt.getTime() > input.slaResolutionDueAt.getTime()) {
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
        if (now > due)
            return 'response_breached';
        const created = input.createdAt?.getTime() ?? due - 8 * 3600000;
        const totalWindow = due - created;
        const remaining = due - now;
        if (totalWindow > 0 && remaining < totalWindow * 0.25) {
            return 'approaching_response';
        }
    }
    if (input.slaResolutionDueAt) {
        const due = input.slaResolutionDueAt.getTime();
        if (now > due)
            return 'resolution_breached';
        const start = input.firstResponseAt?.getTime() ??
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
function toSlaSettingsResponse(settings) {
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
//# sourceMappingURL=sla.utils.js.map