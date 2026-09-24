"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Bell, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/lib/toast";
import { leadsService } from "@/services";
import type {
  CrmReminderBoard,
  CrmReminderTask,
  CrmReminderTaskStatus,
} from "@/services/types";

const COLUMN_COLORS: Record<CrmReminderTaskStatus, string> = {
  PENDING: "#F97316",
  DONE: "#22C55E",
  CANCELLED: "#94A3B8",
};

function formatDueDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function isOverdue(task: CrmReminderTask) {
  if (task.status !== "PENDING") return false;
  return new Date(task.dueDate).getTime() < Date.now();
}

interface CrmReminderKanbanProps {
  board: CrmReminderBoard;
  onBoardChange: (board: CrmReminderBoard) => void;
}

export function CrmReminderKanban({
  board,
  onBoardChange,
}: CrmReminderKanbanProps) {
  function applyMove(
    taskId: string,
    toStatus: CrmReminderTaskStatus,
    toIndex: number,
  ): CrmReminderBoard {
    const moving = board.columns
      .flatMap((column) => column.tasks)
      .find((task) => task.id === taskId);
    if (!moving) return board;

    const without = board.columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => task.id !== taskId),
    }));

    return {
      ...board,
      columns: without.map((column) => {
        if (column.status !== toStatus) return column;
        const tasks = [...column.tasks];
        tasks.splice(toIndex, 0, { ...moving, status: toStatus });
        return { ...column, tasks };
      }),
    };
  }

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const toStatus = destination.droppableId as CrmReminderTaskStatus;
    const previous = board;
    onBoardChange(applyMove(draggableId, toStatus, destination.index));

    try {
      const updated = await leadsService.updateReminderStatus(
        draggableId,
        toStatus,
      );
      onBoardChange(applyMove(updated.id, updated.status, destination.index));
    } catch {
      onBoardChange(previous);
      toast.error("Não foi possível atualizar o lembrete.");
    }
  }

  return (
    <DragDropContext onDragEnd={(result) => void handleDragEnd(result)}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {board.columns.map((column) => {
          const color = COLUMN_COLORS[column.status];
          return (
            <div key={column.status} className="flex w-72 shrink-0 flex-col">
              <div
                className="rounded-t-2xl border border-b-0 px-3 py-2.5"
                style={{
                  borderColor: `${color}40`,
                  backgroundColor: `${color}14`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <h2 className="text-sm font-semibold text-[var(--atria-primary)]">
                      {column.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-[var(--atria-primary)]/70">
                    {column.tasks.length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex min-h-[420px] flex-1 flex-col gap-3 rounded-b-2xl border border-t-0 p-3 transition-colors ${
                      snapshot.isDraggingOver
                        ? "border-[var(--atria-accent)] bg-[var(--atria-accent)]/10"
                        : "border-[var(--atria-primary)]/10 bg-[var(--atria-primary)]/[0.02]"
                    }`}
                    style={{
                      borderLeftColor: `${color}55`,
                      borderLeftWidth: 2,
                    }}
                  >
                    {column.tasks.length === 0 && (
                      <p className="py-8 text-center text-xs text-[var(--atria-primary)]/40">
                        Sem lembretes nesta coluna
                      </p>
                    )}

                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={
                              dragSnapshot.isDragging
                                ? "opacity-95 shadow-lg"
                                : ""
                            }
                          >
                            <ReminderCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

function ReminderCard({ task }: { task: CrmReminderTask }) {
  const overdue = isOverdue(task);

  return (
    <div className="rounded-xl border border-[var(--atria-primary)]/10 bg-white p-3 shadow-sm">
      <div className="flex items-start gap-2">
        <Bell className="mt-0.5 size-4 shrink-0 text-[var(--atria-primary)]/45" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--atria-primary)]">
            {task.title}
          </p>
          {task.lead && (
            <p className="mt-1 truncate text-xs text-[var(--atria-primary)]/55">
              {task.lead.name}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant={overdue ? "destructive" : "outline"} className="gap-1">
          <CalendarClock className="size-3" />
          {overdue ? "Atrasado · " : ""}
          {formatDueDate(task.dueDate)}
        </Badge>
        {task.lead?.phone && (
          <span className="text-[11px] text-[var(--atria-primary)]/45">
            {task.lead.phone}
          </span>
        )}
      </div>
    </div>
  );
}
