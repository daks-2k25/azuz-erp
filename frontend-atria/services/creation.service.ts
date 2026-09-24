import { apiRequest } from "./api";
import type {
  BriefContentPlan,
  BriefPlanCreateResult,
  ContentPlatform,
  CreateBriefPlanInput,
  CreateDeliverableInput,
  CreationClientPipeline,
  CreationDeliverableStatusInput,
  CreationCommandCenter,
  CreationPipelineItem,
} from "./types";

export function getCommandCenter() {
  return apiRequest<CreationCommandCenter>("/creation/command-center");
}

export function getClientPipeline(
  clientId: string,
  params?: { from?: string; to?: string },
) {
  const query = new URLSearchParams({ clientId });
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);

  return apiRequest<CreationClientPipeline>(
    `/creation/pipeline?${query.toString()}`,
  );
}

export function createDeliverable(data: CreateDeliverableInput) {
  return apiRequest<{ source: "post" | "event"; item: CreationPipelineItem }>(
    "/creation/deliverables",
    {
      method: "POST",
      body: data,
    },
  );
}

export function updateItemStatus(
  source: "post" | "event",
  id: string,
  status: CreationDeliverableStatusInput,
) {
  return apiRequest<{ item: CreationPipelineItem }>(
    `/creation/pipeline/items/${source}/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
}

export function updatePipelineInternalReview(
  source: "post" | "event",
  id: string,
  status: "pending" | "approved" | "rejected",
  note?: string,
) {
  return apiRequest<{ item: CreationPipelineItem }>(
    `/creation/pipeline/items/${source}/${id}/internal-review`,
    {
      method: "PATCH",
      body: { status, note },
    },
  );
}

export function generateFromBrief(data: {
  brief: string;
  clientId: string;
  platform?: ContentPlatform;
  objective?: string;
}) {
  const body: Record<string, unknown> = {
    brief: data.brief,
    clientId: data.clientId,
    objective: data.objective,
  };
  if (data.platform) body.platform = data.platform.toUpperCase();

  return apiRequest<BriefContentPlan>("/creation/brief-to-content/generate", {
    method: "POST",
    body,
  });
}

export function createFromBriefPlan(data: CreateBriefPlanInput) {
  return apiRequest<BriefPlanCreateResult>(
    "/creation/brief-to-content/create",
    {
      method: "POST",
      body: {
        clientId: data.clientId,
        platform: data.platform.toUpperCase(),
        createKanbanTasks: data.createKanbanTasks ?? true,
        ideas: data.ideas.map((idea) => ({
          ...idea,
          format: idea.format.toUpperCase(),
        })),
      },
    },
  );
}
