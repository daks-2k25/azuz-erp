"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@/contexts/notifications-context";
import { appUpdateKeys } from "@/lib/query-keys";
import { appUpdatesService } from "@/services";
import type { AppNotification } from "@/services/types";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const { markAsRead, refresh } = useNotifications();

  return useCallback(
    async (notification: AppNotification) => {
      if (notification.isRead) return;

      if (notification.type === "app_update" && notification.appUpdateId) {
        await appUpdatesService.markAppUpdateAsRead(notification.appUpdateId);
      } else {
        await markAsRead(notification.id);
      }

      if (notification.type === "app_update") {
        await queryClient.invalidateQueries({
          queryKey: appUpdateKeys.root,
        });
      }

      await refresh();
    },
    [markAsRead, queryClient, refresh],
  );
}
