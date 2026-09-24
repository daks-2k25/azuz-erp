"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TASK_STATUS = exports.DEFAULT_KANBAN_COLUMNS = void 0;
const client_1 = require("@prisma/client");
const kanban_status_1 = require("./kanban-status");
exports.DEFAULT_KANBAN_COLUMNS = kanban_status_1.KANBAN_STATUS_DEFINITIONS.map((def) => ({
    title: def.title,
    order: def.order,
    color: def.color,
    type: client_1.KanbanColumnType.CUSTOM,
    statusKey: def.status,
}));
exports.DEFAULT_TASK_STATUS = client_1.KanbanTaskStatus.FALTA_GRAVAR;
//# sourceMappingURL=kanban-defaults.js.map