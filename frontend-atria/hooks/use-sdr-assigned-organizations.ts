"use client";

import { useCallback, useEffect, useState } from "react";
import { organizationsService } from "@/services";
import type { Organization } from "@/services/types";

export function useSdrAssignedOrganizations(enabled = true) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(enabled);

  const reload = useCallback(async () => {
    if (!enabled) {
      setOrganizations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setOrganizations(await organizationsService.getAssignedOrganizations());
    } catch {
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { organizations, loading, reload };
}
