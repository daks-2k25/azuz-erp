import type { UserRole } from "./index";

export type AppUpdateVisibleRole = Exclude<
  UserRole,
  "client" | "external_client_crm"
>;

export interface AppUpdateAuthor {
  id: string;
  name: string;
  email: string;
}

export interface AppUpdate {
  id: string;
  title: string;
  body: string;
  visibleRoles: AppUpdateVisibleRole[];
  isPublished: boolean;
  createdById: string;
  createdBy: AppUpdateAuthor;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

export interface AppUpdatesAccess {
  canView: boolean;
  canManage: boolean;
  unreadCount: number;
  updateCount: number;
}

export interface CreateAppUpdateInput {
  title: string;
  body: string;
  visibleRoles: AppUpdateVisibleRole[];
  isPublished?: boolean;
}

export interface UpdateAppUpdateInput {
  title?: string;
  body?: string;
  visibleRoles?: AppUpdateVisibleRole[];
  isPublished?: boolean;
}
