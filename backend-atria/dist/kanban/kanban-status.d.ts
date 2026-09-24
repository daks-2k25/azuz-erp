import { KanbanTaskStatus } from '@prisma/client';
export declare const KANBAN_STATUS_DEFINITIONS: ReadonlyArray<{
    status: KanbanTaskStatus;
    title: string;
    color: string;
    order: number;
}>;
export declare const STATUS_COLORS: Record<KanbanTaskStatus, string>;
export declare const STATUS_LABELS: Record<KanbanTaskStatus, string>;
export type KanbanTaskStatusApi = 'ok' | 'producao' | 'falta_gravar' | 'jhonatan_reprova' | 'cliente_reprovou' | 'jhonatan_aprovou';
export declare function statusToApi(status: KanbanTaskStatus): KanbanTaskStatusApi;
export declare function statusFromApi(value: KanbanTaskStatusApi): KanbanTaskStatus;
