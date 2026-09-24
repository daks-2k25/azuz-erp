"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TV_TASK_DELIVERY_BUCKETS = void 0;
exports.resolveTvTaskDeliveryBucket = resolveTvTaskDeliveryBucket;
exports.createEmptyTvTaskDeliveryMetrics = createEmptyTvTaskDeliveryMetrics;
exports.createEmptyTvTaskDeliveryTasks = createEmptyTvTaskDeliveryTasks;
exports.buildLeadStageTemplate = buildLeadStageTemplate;
exports.applyLeadStageCounts = applyLeadStageCounts;
exports.serializeTaskStatus = serializeTaskStatus;
const client_1 = require("@prisma/client");
const lead_kanban_constants_1 = require("../leads/lead-kanban.constants");
const kanban_status_1 = require("../kanban/kanban-status");
exports.TV_TASK_DELIVERY_BUCKETS = {
    taskCreated: [client_1.KanbanTaskStatus.FALTA_GRAVAR],
    awaitingJhonatan: [client_1.KanbanTaskStatus.PRODUCAO],
    awaitingClient: [client_1.KanbanTaskStatus.JHONATAN_APROVOU],
};
const STATUS_TO_BUCKET = new Map(Object.entries(exports.TV_TASK_DELIVERY_BUCKETS).flatMap(([bucket, statuses]) => statuses.map((status) => [status, bucket])));
function resolveTvTaskDeliveryBucket(status) {
    return STATUS_TO_BUCKET.get(status) ?? null;
}
function createEmptyTvTaskDeliveryMetrics() {
    return {
        taskCreated: 0,
        awaitingJhonatan: 0,
        awaitingClient: 0,
        total: 0,
    };
}
function createEmptyTvTaskDeliveryTasks() {
    return {
        taskCreated: [],
        awaitingJhonatan: [],
        awaitingClient: [],
    };
}
function buildLeadStageTemplate() {
    return lead_kanban_constants_1.LEAD_KANBAN_STATUSES.map((status) => ({
        status: status.toLowerCase(),
        label: lead_kanban_constants_1.LEAD_STATUS_LABELS[status],
        color: lead_kanban_constants_1.LEAD_STATUS_COLORS[status],
        count: 0,
    }));
}
function applyLeadStageCounts(stages, counts) {
    const countByStatus = new Map(counts.map((entry) => [entry.status, entry.count]));
    return stages.map((stage) => {
        const status = stage.status.toUpperCase();
        return {
            ...stage,
            count: countByStatus.get(status) ?? 0,
        };
    });
}
function serializeTaskStatus(status) {
    return (0, kanban_status_1.statusToApi)(status);
}
//# sourceMappingURL=dashboard-tv.constants.js.map