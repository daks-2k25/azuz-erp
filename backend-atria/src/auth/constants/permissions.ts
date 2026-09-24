import { RoleName } from '@prisma/client';

export const Permission = {
  SYSTEM_ALL: 'system:all',
  USERS_MANAGE: 'users:manage',
  USERS_DEACTIVATE: 'users:deactivate',
  INVITATIONS_MANAGE: 'invitations:manage',
  KANBAN_ALL_EDIT: 'kanban:all:edit',
  KANBAN_OWN_EDIT: 'kanban:own:edit',
  CALENDAR_ALL_EDIT: 'calendar:all:edit',
  CALENDAR_OWN_EDIT: 'calendar:own:edit',
  CRM_ALL: 'crm:all',
  CRM_ORG_LEADS: 'crm:org:leads',
  PORTAL_ACCESS: 'portal:access',
  DELIVERABLES_OWN: 'deliverables:own',
  FINANCE_ACCESS: 'finance:access',
  SETTINGS_MANAGE: 'settings:manage',
  TIMECLOCK_MANAGE: 'timeclock:manage',
} as const;

export type PermissionKey = (typeof Permission)[keyof typeof Permission];

export const ROLE_PERMISSIONS: Record<RoleName, PermissionKey[]> = {
  [RoleName.MASTER]: [Permission.SYSTEM_ALL],
  [RoleName.ADMIN]: [
    Permission.USERS_MANAGE,
    Permission.USERS_DEACTIVATE,
    Permission.INVITATIONS_MANAGE,
    Permission.KANBAN_ALL_EDIT,
    Permission.CALENDAR_ALL_EDIT,
    Permission.CRM_ALL,
    Permission.FINANCE_ACCESS,
    Permission.SETTINGS_MANAGE,
    Permission.TIMECLOCK_MANAGE,
  ],
  [RoleName.MANAGER]: [],
  [RoleName.USER]: [],
  [RoleName.CONTENT_CREATOR]: [],
  [RoleName.DESIGNER_MASTER]: [
    Permission.KANBAN_ALL_EDIT,
    Permission.CALENDAR_ALL_EDIT,
  ],
  [RoleName.DESIGNER_JUNIOR]: [
    Permission.KANBAN_OWN_EDIT,
    Permission.CALENDAR_OWN_EDIT,
  ],
  [RoleName.CRM]: [Permission.CRM_ALL],
  [RoleName.EXTERNAL_CLIENT_CRM]: [Permission.CRM_ORG_LEADS],
  [RoleName.CLIENT]: [Permission.PORTAL_ACCESS, Permission.DELIVERABLES_OWN],
};
export const INTERNAL_STAFF_ROLES: RoleName[] = [
  RoleName.MASTER,
  RoleName.ADMIN,
  RoleName.DESIGNER_MASTER,
  RoleName.DESIGNER_JUNIOR,
  RoleName.CRM,
];

export const INVITATION_MANAGER_ROLES: RoleName[] = [
  RoleName.MASTER,
  RoleName.ADMIN,
];

export function normalizeRoleName(role: string): RoleName | null {
  const normalized = role.toUpperCase() as RoleName;
  return Object.values(RoleName).includes(normalized) ? normalized : null;
}

export function resolvePermissions(role: string): PermissionKey[] {
  const roleName = normalizeRoleName(role);
  if (!roleName) return [];
  return ROLE_PERMISSIONS[roleName] ?? [];
}

export function hasPermission(
  role: string,
  required: PermissionKey | PermissionKey[],
): boolean {
  const permissions = resolvePermissions(role);
  if (permissions.includes(Permission.SYSTEM_ALL)) {
    return true;
  }

  const requiredList = Array.isArray(required) ? required : [required];
  return requiredList.every((permission) => permissions.includes(permission));
}

export function hasAnyPermission(
  role: string,
  required: PermissionKey[],
): boolean {
  const permissions = resolvePermissions(role);
  if (permissions.includes(Permission.SYSTEM_ALL)) {
    return true;
  }

  return required.some((permission) => permissions.includes(permission));
}

export function isClientFacingRole(role: string): boolean {
  const roleName = normalizeRoleName(role);
  return (
    roleName === RoleName.CLIENT || roleName === RoleName.EXTERNAL_CLIENT_CRM
  );
}
