export const taskKeys = {
  all: (companyId: string) => ["tasks", companyId] as const,
  root: ["tasks"] as const,
};

export const tvMonitoringKeys = {
  all: (companyId: string) => ["tv-monitoring", companyId] as const,
  root: ["tv-monitoring"] as const,
};

export const calendarKeys = {
  all: (companyId: string) => ["calendar", companyId] as const,
  events: (
    companyId: string,
    params: { from?: string; to?: string; clientId?: string | null },
  ) =>
    [
      "calendar",
      companyId,
      "events",
      params.from ?? null,
      params.to ?? null,
      params.clientId ?? null,
    ] as const,
  root: ["calendar"] as const,
};

export const creationKeys = {
  all: (companyId: string) => ["creation", companyId] as const,
  pipeline: (
    companyId: string,
    clientId: string,
    from?: string,
    to?: string,
  ) =>
    [
      "creation",
      companyId,
      "pipeline",
      clientId,
      from ?? null,
      to ?? null,
    ] as const,
  root: ["creation"] as const,
};

export const internalApprovalKeys = {
  all: (companyId: string) => ["internal-approvals", companyId] as const,
  root: ["internal-approvals"] as const,
};

export const suggestionKeys = {
  mine: (companyId: string) => ["suggestions", companyId, "mine"] as const,
  all: (companyId: string) => ["suggestions", companyId, "all"] as const,
  root: ["suggestions"] as const,
};

export const appUpdateKeys = {
  access: (companyId: string) => ["app-updates", companyId, "access"] as const,
  list: (companyId: string) => ["app-updates", companyId, "list"] as const,
  root: ["app-updates"] as const,
};

export const timeTrackingKeys = {
  workSchedules: (companyId: string) =>
    ["time-tracking", companyId, "work-schedules"] as const,
  employees: (companyId: string) =>
    ["time-tracking", companyId, "employees"] as const,
  myProfile: (companyId: string) =>
    ["time-tracking", companyId, "my-profile"] as const,
  todayClock: (companyId: string) =>
    ["time-tracking", companyId, "today-clock"] as const,
  root: ["time-tracking"] as const,
};
