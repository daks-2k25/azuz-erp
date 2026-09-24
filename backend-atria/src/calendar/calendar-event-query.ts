import { Prisma } from '@prisma/client';

export function buildCalendarDateRange(
  from?: string,
  to?: string,
): Prisma.DateTimeFilter | undefined {
  if (!from && !to) return undefined;

  const range: Prisma.DateTimeFilter = {};
  if (from) range.gte = new Date(from);
  if (to) range.lte = new Date(to);
  return range;
}

export function buildCalendarGridWhere(params: {
  from?: string;
  to?: string;
  clientId?: string;
}): Prisma.CalendarEventWhereInput {
  const range = buildCalendarDateRange(params.from, params.to);
  const publicationDate: Prisma.DateTimeNullableFilter = {
    not: null,
    ...(range ?? {}),
  };

  const where: Prisma.CalendarEventWhereInput = {
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

export function buildUnmappedCalendarTasksWhere(params: {
  clientId?: string;
}): Prisma.KanbanTaskWhereInput {
  return {
    deletedAt: null,
    publicationDate: null,
    ...(params.clientId ? { clientId: params.clientId } : {}),
  };
}
