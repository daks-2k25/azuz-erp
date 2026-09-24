"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK_CONTENT_TYPE_DEFINITIONS = exports.DEFAULT_TASK_CONTENT_TYPE = void 0;
exports.contentTypeToApi = contentTypeToApi;
exports.isKanbanTaskContentType = isKanbanTaskContentType;
exports.resolveTaskContentType = resolveTaskContentType;
const client_1 = require("@prisma/client");
exports.DEFAULT_TASK_CONTENT_TYPE = client_1.KanbanTaskContentType.VIDEO_WITH_SCRIPT;
exports.TASK_CONTENT_TYPE_DEFINITIONS = [
    {
        value: client_1.KanbanTaskContentType.VIDEO_WITH_SCRIPT,
        label: 'Vídeo',
    },
    {
        value: client_1.KanbanTaskContentType.STATIC,
        label: 'Estático',
    },
    {
        value: client_1.KanbanTaskContentType.CAROUSEL,
        label: 'Carrossel',
    },
    {
        value: client_1.KanbanTaskContentType.STORIES_NO_SCRIPT,
        label: 'Stories',
    },
];
function contentTypeToApi(contentType) {
    return contentType.toLowerCase();
}
function isKanbanTaskContentType(value) {
    return (value === client_1.KanbanTaskContentType.VIDEO_WITH_SCRIPT ||
        value === client_1.KanbanTaskContentType.STATIC ||
        value === client_1.KanbanTaskContentType.CAROUSEL ||
        value === client_1.KanbanTaskContentType.STORIES_NO_SCRIPT);
}
function resolveTaskContentType(value) {
    return isKanbanTaskContentType(value) ? value : exports.DEFAULT_TASK_CONTENT_TYPE;
}
//# sourceMappingURL=kanban-content-type.js.map