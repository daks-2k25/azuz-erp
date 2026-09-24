import { apiRequest } from "./api";
import type { AppNotification } from "./types";

export async function getNotifications(unreadOnly = false) {
  const qs = unreadOnly ? "?unreadOnly=true" : "";
  return apiRequest<AppNotification[]>(`/notifications${qs}`, {
    skipToast: true,
  });
}

export async function getUnreadCount() {
  return apiRequest<number>("/notifications/unread-count", { skipToast: true });
}

export async function markAsRead(id: string) {
  return apiRequest<AppNotification>(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export async function markAllAsRead() {
  return apiRequest<{ success: boolean }>("/notifications/read-all", {
    method: "PATCH",
  });
}
