import type { AppUpdateVisibleRole } from "@/services/types";
import { ROLE_LABELS } from "./permissions";

export const APP_UPDATE_VISIBLE_ROLES: AppUpdateVisibleRole[] = [
  "master",
  "admin",
  "manager",
  "user",
  "content_creator",
  "designer_master",
  "designer_junior",
  "crm",
];

export function getAppUpdateRoleLabel(role: string): string {
  return ROLE_LABELS[role.toLowerCase()] ?? role;
}

export function formatAppUpdateRoles(roles: string[]): string {
  return roles.map((role) => getAppUpdateRoleLabel(role)).join(", ");
}
