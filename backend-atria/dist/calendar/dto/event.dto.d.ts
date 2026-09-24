import { EventCategory, KanbanTaskStatus } from '@prisma/client';
export declare class CreateEventDto {
    title: string;
    description?: string;
    startAt: string;
    endAt: string;
    category?: EventCategory;
    color?: string;
    isPending?: boolean;
    assigneeId?: string;
    assignedGroupId?: string;
    clientId?: string;
    referenceUrl?: string;
    createKanbanTask?: boolean;
}
export declare class UpdateEventDto {
    title?: string;
    description?: string;
    startAt?: string;
    endAt?: string;
    category?: EventCategory;
    color?: string;
    status?: KanbanTaskStatus;
    isPending?: boolean;
    assigneeId?: string | null;
    assignedGroupId?: string | null;
    clientId?: string | null;
    referenceUrl?: string | null;
}
export declare class QueryEventsDto {
    from?: string;
    to?: string;
    clientId?: string;
    includeUnmapped?: boolean;
}
