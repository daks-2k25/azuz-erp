import { KanbanTaskStatus } from '@prisma/client';

export const KANBAN_STATUS_DEFINITIONS: ReadonlyArray<{
  status: KanbanTaskStatus;
  title: string;
  color: string;
  order: number;
}> = [
  {
    status: KanbanTaskStatus.FALTA_GRAVAR,
    title: 'Em produção',
    color: '#78716C',
    order: 1,
  },
  {
    status: KanbanTaskStatus.PRODUCAO,
    title: 'Esperando aprovação Jhonatan',
    color: '#EAB308',
    order: 2,
  },
  {
    status: KanbanTaskStatus.JHONATAN_REPROVA,
    title: 'Necessita Ajuste',
    color: '#EF4444',
    order: 3,
  },
  {
    status: KanbanTaskStatus.JHONATAN_APROVOU,
    title: 'Esperando aprovação do cliente',
    color: '#3B82F6',
    order: 4,
  },
  { status: KanbanTaskStatus.OK, title: 'OK', color: '#22C55E', order: 5 },
];

export const STATUS_COLORS: Record<KanbanTaskStatus, string> =
  Object.fromEntries(
    KANBAN_STATUS_DEFINITIONS.map((d) => [d.status, d.color]),
  ) as Record<KanbanTaskStatus, string>;

export const STATUS_LABELS: Record<KanbanTaskStatus, string> =
  Object.fromEntries(
    KANBAN_STATUS_DEFINITIONS.map((d) => [d.status, d.title]),
  ) as Record<KanbanTaskStatus, string>;

export type KanbanTaskStatusApi =
  | 'ok'
  | 'producao'
  | 'falta_gravar'
  | 'jhonatan_reprova'
  | 'cliente_reprovou'
  | 'jhonatan_aprovou';

export function statusToApi(status: KanbanTaskStatus): KanbanTaskStatusApi {
  return status.toLowerCase() as KanbanTaskStatusApi;
}

export function statusFromApi(value: KanbanTaskStatusApi): KanbanTaskStatus {
  return value.toUpperCase() as KanbanTaskStatus;
}
