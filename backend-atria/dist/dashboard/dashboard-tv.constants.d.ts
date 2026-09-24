import { KanbanTaskStatus, LeadStatus } from '@prisma/client';
export type TvTaskDeliveryBucket = 'taskCreated' | 'awaitingJhonatan' | 'awaitingClient';
export declare const TV_TASK_DELIVERY_BUCKETS: Record<TvTaskDeliveryBucket, readonly KanbanTaskStatus[]>;
export declare function resolveTvTaskDeliveryBucket(status: KanbanTaskStatus): TvTaskDeliveryBucket | null;
export declare function createEmptyTvTaskDeliveryMetrics(): {
    taskCreated: number;
    awaitingJhonatan: number;
    awaitingClient: number;
    total: number;
};
export declare function createEmptyTvTaskDeliveryTasks(): {
    taskCreated: Array<{
        id: string;
        title: string;
        status: string;
        priority: string;
        dueDate: string | null;
        clientName: string | null;
    }>;
    awaitingJhonatan: Array<{
        id: string;
        title: string;
        status: string;
        priority: string;
        dueDate: string | null;
        clientName: string | null;
    }>;
    awaitingClient: Array<{
        id: string;
        title: string;
        status: string;
        priority: string;
        dueDate: string | null;
        clientName: string | null;
    }>;
};
export declare function buildLeadStageTemplate(): {
    status: string;
    label: string;
    color: string;
    count: number;
}[];
export declare function applyLeadStageCounts(stages: ReturnType<typeof buildLeadStageTemplate>, counts: Array<{
    status: LeadStatus;
    count: number;
}>): {
    count: number;
    status: string;
    label: string;
    color: string;
}[];
export declare function serializeTaskStatus(status: KanbanTaskStatus): import("../kanban/kanban-status").KanbanTaskStatusApi;
