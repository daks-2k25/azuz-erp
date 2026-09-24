"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_LABELS = exports.STATUS_COLORS = exports.KANBAN_STATUS_DEFINITIONS = void 0;
exports.statusToApi = statusToApi;
exports.statusFromApi = statusFromApi;
const client_1 = require("@prisma/client");
exports.KANBAN_STATUS_DEFINITIONS = [
    {
        status: client_1.KanbanTaskStatus.FALTA_GRAVAR,
        title: 'Em produção',
        color: '#78716C',
        order: 1,
    },
    {
        status: client_1.KanbanTaskStatus.PRODUCAO,
        title: 'Esperando aprovação Jhonatan',
        color: '#EAB308',
        order: 2,
    },
    {
        status: client_1.KanbanTaskStatus.JHONATAN_REPROVA,
        title: 'Necessita Ajuste',
        color: '#EF4444',
        order: 3,
    },
    {
        status: client_1.KanbanTaskStatus.JHONATAN_APROVOU,
        title: 'Esperando aprovação do cliente',
        color: '#3B82F6',
        order: 4,
    },
    { status: client_1.KanbanTaskStatus.OK, title: 'OK', color: '#22C55E', order: 5 },
];
exports.STATUS_COLORS = Object.fromEntries(exports.KANBAN_STATUS_DEFINITIONS.map((d) => [d.status, d.color]));
exports.STATUS_LABELS = Object.fromEntries(exports.KANBAN_STATUS_DEFINITIONS.map((d) => [d.status, d.title]));
function statusToApi(status) {
    return status.toLowerCase();
}
function statusFromApi(value) {
    return value.toUpperCase();
}
//# sourceMappingURL=kanban-status.js.map