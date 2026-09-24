import { apiRequest, uploadFile } from "./api";
import type { DeliverableFullView, InternalApprovalItem } from "./types";

export function listPending() {
  return apiRequest<InternalApprovalItem[]>("/internal-approvals");
}

export function approve(id: string, note?: string) {
  return apiRequest<DeliverableFullView>(`/internal-approvals/${id}/approve`, {
    method: "POST",
    body: note?.trim() ? { note: note.trim() } : {},
  });
}

export function submitDelivery(id: string, file: File, caption?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (caption?.trim()) {
    formData.append("caption", caption.trim());
  }
  return uploadFile(`/internal-approvals/${id}/submit-delivery`, formData);
}

export function requestAdjustment(id: string, note: string) {
  return apiRequest<DeliverableFullView>(
    `/internal-approvals/${id}/request-adjustment`,
    {
      method: "POST",
      body: { note: note.trim() },
    },
  );
}
