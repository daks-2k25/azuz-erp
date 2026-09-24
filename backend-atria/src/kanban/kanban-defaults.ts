import { KanbanColumnType, KanbanTaskStatus } from '@prisma/client';
import { KANBAN_STATUS_DEFINITIONS } from './kanban-status';

export const DEFAULT_KANBAN_COLUMNS = KANBAN_STATUS_DEFINITIONS.map((def) => ({
  title: def.title,
  order: def.order,
  color: def.color,
  type: KanbanColumnType.CUSTOM,
  statusKey: def.status,
}));

export const DEFAULT_TASK_STATUS = KanbanTaskStatus.FALTA_GRAVAR;
