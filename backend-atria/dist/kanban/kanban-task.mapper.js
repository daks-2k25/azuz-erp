"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTaskClientResponse = toTaskClientResponse;
exports.toUnifiedTaskCore = toUnifiedTaskCore;
const client_1 = require("@prisma/client");
const kanban_content_type_1 = require("./kanban-content-type");
const kanban_status_1 = require("./kanban-status");
const production_phase_1 = require("./production-phase");
function toTaskClientResponse(client) {
    if (!client)
        return null;
    return {
        id: client.id,
        name: client.companyName,
        companyName: client.companyName,
        avatarUrl: client.avatarUrl,
    };
}
function toUnifiedTaskCore(task) {
    const productionPhase = task.productionPhase && task.status === client_1.KanbanTaskStatus.FALTA_GRAVAR
        ? (0, production_phase_1.phaseToApi)(task.productionPhase)
        : null;
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: (0, kanban_status_1.statusToApi)(task.status),
        productionPhase,
        contentType: (0, kanban_content_type_1.contentTypeToApi)((0, kanban_content_type_1.resolveTaskContentType)(task.contentType)),
        statusColor: (0, production_phase_1.resolveTaskDisplayColor)(task.status, task.productionPhase, kanban_status_1.STATUS_COLORS),
        statusLabel: (0, production_phase_1.resolveTaskDisplayLabel)(task.status, task.productionPhase, kanban_status_1.STATUS_LABELS),
        dueDate: task.dueDate?.toISOString() ?? null,
        publicationDate: task.publicationDate?.toISOString() ?? null,
        deliveryDate: task.deliveryDate?.toISOString() ?? null,
        clientId: task.clientId,
        companyId: task.companyId,
        client: toTaskClientResponse(task.client),
        createdAt: task.createdAt.toISOString(),
    };
}
//# sourceMappingURL=kanban-task.mapper.js.map