import { KanbanTaskStatus, LeadStatus } from '@prisma/client';
import {
  LEAD_KANBAN_STATUSES,
  LEAD_STATUS_COLORS,
  LEAD_STATUS_LABELS,
} from '../leads/lead-kanban.constants';
import { statusToApi } from '../kanban/kanban-status';

export type TvTaskDeliveryBucket =
  | 'taskCreated'
  | 'awaitingJhonatan'
  | 'awaitingClient';

export const TV_TASK_DELIVERY_BUCKETS: Record<
  TvTaskDeliveryBucket,
  readonly KanbanTaskStatus[]
> = {
  taskCreated: [KanbanTaskStatus.FALTA_GRAVAR],
  awaitingJhonatan: [KanbanTaskStatus.PRODUCAO],
  awaitingClient: [KanbanTaskStatus.JHONATAN_APROVOU],
};

const STATUS_TO_BUCKET = new Map<KanbanTaskStatus, TvTaskDeliveryBucket>(
  Object.entries(TV_TASK_DELIVERY_BUCKETS).flatMap(([bucket, statuses]) =>
    statuses.map((status) => [status, bucket as TvTaskDeliveryBucket]),
  ),
);

export function resolveTvTaskDeliveryBucket(
  status: KanbanTaskStatus,
): TvTaskDeliveryBucket | null {
  return STATUS_TO_BUCKET.get(status) ?? null;
}

export function createEmptyTvTaskDeliveryMetrics() {
  return {
    taskCreated: 0,
    awaitingJhonatan: 0,
    awaitingClient: 0,
    total: 0,
  };
}

export function createEmptyTvTaskDeliveryTasks() {
  return {
    taskCreated: [] as Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
      dueDate: string | null;
      clientName: string | null;
    }>,
    awaitingJhonatan: [] as Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
      dueDate: string | null;
      clientName: string | null;
    }>,
    awaitingClient: [] as Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
      dueDate: string | null;
      clientName: string | null;
    }>,
  };
}

export function buildLeadStageTemplate() {
  return LEAD_KANBAN_STATUSES.map((status) => ({
    status: status.toLowerCase(),
    label: LEAD_STATUS_LABELS[status],
    color: LEAD_STATUS_COLORS[status],
    count: 0,
  }));
}

export function applyLeadStageCounts(
  stages: ReturnType<typeof buildLeadStageTemplate>,
  counts: Array<{ status: LeadStatus; count: number }>,
) {
  const countByStatus = new Map(counts.map((entry) => [entry.status, entry.count]));

  return stages.map((stage) => {
    const status = stage.status.toUpperCase() as LeadStatus;
    return {
      ...stage,
      count: countByStatus.get(status) ?? 0,
    };
  });
}

export function serializeTaskStatus(status: KanbanTaskStatus) {
  return statusToApi(status);
}
