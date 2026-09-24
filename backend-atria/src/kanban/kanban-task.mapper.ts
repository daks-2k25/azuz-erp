import {
  KanbanTaskContentType,
  KanbanTaskStatus,
  ProductionPhase,
} from '@prisma/client';
import {
  contentTypeToApi,
  resolveTaskContentType,
  type KanbanTaskContentTypeApi,
} from './kanban-content-type';
import {
  KanbanTaskStatusApi,
  STATUS_COLORS,
  STATUS_LABELS,
  statusToApi,
} from './kanban-status';
import {
  phaseToApi,
  resolveTaskDisplayColor,
  resolveTaskDisplayLabel,
  type ProductionPhaseApi,
} from './production-phase';

export interface UnifiedTaskClient {
  id: string;
  name: string;
  companyName: string;
  avatarUrl: string | null;
}

export interface UnifiedTaskCore {
  id: string;
  title: string;
  description: string | null;
  status: KanbanTaskStatusApi;
  productionPhase: ProductionPhaseApi | null;
  contentType: KanbanTaskContentTypeApi;
  statusColor: string;
  statusLabel: string;
  dueDate: string | null;
  publicationDate: string | null;
  deliveryDate: string | null;
  clientId: string | null;
  companyId: string;
  client: UnifiedTaskClient | null;
  createdAt: string;
}

type TaskClientRecord = {
  id: string;
  companyName: string;
  avatarUrl: string | null;
};

export function toTaskClientResponse(
  client: TaskClientRecord | null | undefined,
): UnifiedTaskClient | null {
  if (!client) return null;
  return {
    id: client.id,
    name: client.companyName,
    companyName: client.companyName,
    avatarUrl: client.avatarUrl,
  };
}

export function toUnifiedTaskCore(task: {
  id: string;
  title: string;
  description: string | null;
  status: KanbanTaskStatus;
  productionPhase?: ProductionPhase | null;
  contentType?: KanbanTaskContentType | null;
  dueDate: Date | null;
  publicationDate?: Date | null;
  deliveryDate?: Date | null;
  clientId: string | null;
  companyId: string;
  createdAt: Date;
  client?: TaskClientRecord | null;
}): UnifiedTaskCore {
  const productionPhase =
    task.productionPhase && task.status === KanbanTaskStatus.FALTA_GRAVAR
      ? phaseToApi(task.productionPhase)
      : null;

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: statusToApi(task.status),
    productionPhase,
    contentType: contentTypeToApi(resolveTaskContentType(task.contentType)),
    statusColor: resolveTaskDisplayColor(
      task.status,
      task.productionPhase,
      STATUS_COLORS,
    ),
    statusLabel: resolveTaskDisplayLabel(
      task.status,
      task.productionPhase,
      STATUS_LABELS,
    ),
    dueDate: task.dueDate?.toISOString() ?? null,
    publicationDate: task.publicationDate?.toISOString() ?? null,
    deliveryDate: task.deliveryDate?.toISOString() ?? null,
    clientId: task.clientId,
    companyId: task.companyId,
    client: toTaskClientResponse(task.client),
    createdAt: task.createdAt.toISOString(),
  };
}
