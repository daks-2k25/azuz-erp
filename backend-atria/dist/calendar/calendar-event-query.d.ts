import { Prisma } from '@prisma/client';
export declare function buildCalendarDateRange(from?: string, to?: string): Prisma.DateTimeFilter | undefined;
export declare function buildCalendarGridWhere(params: {
    from?: string;
    to?: string;
    clientId?: string;
}): Prisma.CalendarEventWhereInput;
export declare function buildUnmappedCalendarTasksWhere(params: {
    clientId?: string;
}): Prisma.KanbanTaskWhereInput;
