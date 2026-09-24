import type {
  KanbanColumn,
  KanbanColumnType,
  KanbanTask,
  KanbanTaskStatus,
  ProductionPhase,
} from "@/services/types";
import {
  resolveTaskDisplayColor,
} from "@/lib/production-phase";

export const DEFAULT_TASK_STATUS: KanbanTaskStatus = "falta_gravar";

export const STATUS_LABELS: Record<KanbanTaskStatus, string> = {
  falta_gravar: "Em produção",
  producao: "Esperando aprovação Jhonatan",
  jhonatan_reprova: "Necessita de ajustes",
  jhonatan_aprovou: "Esperando aprovação do cliente",
  cliente_reprovou: "Reprovado",
  ok: "OK",
};

export const STATUS_COLORS: Record<KanbanTaskStatus, string> = {
  falta_gravar: "#78716C",
  producao: "#EAB308",
  jhonatan_reprova: "#EF4444",
  jhonatan_aprovou: "#3B82F6",
  cliente_reprovou: "#A855F7",
  ok: "#22C55E",
};

export const DEFAULT_TASK_STATUS_COLOR = STATUS_COLORS[DEFAULT_TASK_STATUS];
export const DEFAULT_TASK_STATUS_LABEL = STATUS_LABELS[DEFAULT_TASK_STATUS];

export const STATUS_ORDER: KanbanTaskStatus[] = [
  "falta_gravar",
  "producao",
  "jhonatan_reprova",
  "jhonatan_aprovou",
  "ok",
];

export function getStatusCardStyle(
  status: KanbanTaskStatus,
  productionPhase?: ProductionPhase | null,
) {
  const color = resolveTaskDisplayColor(status, productionPhase, STATUS_COLORS);
  return {
    borderColor: `${color}66`,
    backgroundColor: `${color}12`,
  };
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const COLUMN_TYPE_LABELS: Record<KanbanColumnType, string> = {
  to_do: "A fazer",
  in_progress: "Em andamento",
  done: "Concluído",
  custom: "Personalizada",
};

export function getColumnTypeLabel(type: KanbanColumnType | null): string | null {
  if (!type || type === "custom") return null;
  return COLUMN_TYPE_LABELS[type];
}

export function isFinishedKanbanTask(
  task: Pick<KanbanTask, "status" | "column">,
  column?: Pick<KanbanColumn, "type" | "statusKey" | "title"> | null,
): boolean {
  const target = column ?? task.column;
  if (task.status === "ok") return true;
  if (target?.statusKey === "ok") return true;
  if (target?.type === "done") return true;
  const title = target?.title?.trim().toLowerCase() ?? "";
  return title === "ok" || title === "finalizado" || title.includes("finalizado");
}
