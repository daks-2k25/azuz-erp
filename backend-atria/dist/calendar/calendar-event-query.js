"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCalendarDateRange = buildCalendarDateRange;
exports.buildCalendarGridWhere = buildCalendarGridWhere;
exports.buildUnmappedCalendarTasksWhere = buildUnmappedCalendarTasksWhere;
function buildCalendarDateRange(from, to) {
    if (!from && !to)
        return undefined;
    const range = {};
    if (from)
        range.gte = new Date(from);
    if (to)
        range.lte = new Date(to);
    return range;
}
function buildCalendarGridWhere(params) {
    const range = buildCalendarDateRange(params.from, params.to);
    const publicationDate = {
        not: null,
        ...(range ?? {}),
    };
    const where = {
        AND: [
            {
                OR: [
                    {
                        kanbanTask: { is: null },
                        ...(range ? { startAt: range } : {}),
                    },
                    {
                        kanbanTask: {
                            is: { publicationDate },
                        },
                    },
                ],
            },
        ],
    };
    if (params.clientId) {
        where.clientId = params.clientId;
    }
    return where;
}
function buildUnmappedCalendarTasksWhere(params) {
    return {
        deletedAt: null,
        publicationDate: null,
        ...(params.clientId ? { clientId: params.clientId } : {}),
    };
}
//# sourceMappingURL=calendar-event-query.js.map