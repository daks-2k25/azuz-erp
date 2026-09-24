"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVITATION_MANAGER_ROLES = exports.INTERNAL_STAFF_ROLES = exports.ROLE_PERMISSIONS = exports.Permission = void 0;
exports.normalizeRoleName = normalizeRoleName;
exports.resolvePermissions = resolvePermissions;
exports.hasPermission = hasPermission;
exports.hasAnyPermission = hasAnyPermission;
exports.isClientFacingRole = isClientFacingRole;
const client_1 = require("@prisma/client");
exports.Permission = {
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
};
exports.ROLE_PERMISSIONS = {
    [client_1.RoleName.MASTER]: [exports.Permission.SYSTEM_ALL],
    [client_1.RoleName.ADMIN]: [
        exports.Permission.USERS_MANAGE,
        exports.Permission.USERS_DEACTIVATE,
        exports.Permission.INVITATIONS_MANAGE,
        exports.Permission.KANBAN_ALL_EDIT,
        exports.Permission.CALENDAR_ALL_EDIT,
        exports.Permission.CRM_ALL,
        exports.Permission.FINANCE_ACCESS,
        exports.Permission.SETTINGS_MANAGE,
        exports.Permission.TIMECLOCK_MANAGE,
    ],
    [client_1.RoleName.MANAGER]: [],
    [client_1.RoleName.USER]: [],
    [client_1.RoleName.CONTENT_CREATOR]: [],
    [client_1.RoleName.DESIGNER_MASTER]: [
        exports.Permission.KANBAN_ALL_EDIT,
        exports.Permission.CALENDAR_ALL_EDIT,
    ],
    [client_1.RoleName.DESIGNER_JUNIOR]: [
        exports.Permission.KANBAN_OWN_EDIT,
        exports.Permission.CALENDAR_OWN_EDIT,
    ],
    [client_1.RoleName.CRM]: [exports.Permission.CRM_ALL],
    [client_1.RoleName.EXTERNAL_CLIENT_CRM]: [exports.Permission.CRM_ORG_LEADS],
    [client_1.RoleName.CLIENT]: [exports.Permission.PORTAL_ACCESS, exports.Permission.DELIVERABLES_OWN],
};
exports.INTERNAL_STAFF_ROLES = [
    client_1.RoleName.MASTER,
    client_1.RoleName.ADMIN,
    client_1.RoleName.DESIGNER_MASTER,
    client_1.RoleName.DESIGNER_JUNIOR,
    client_1.RoleName.CRM,
];
exports.INVITATION_MANAGER_ROLES = [
    client_1.RoleName.MASTER,
    client_1.RoleName.ADMIN,
];
function normalizeRoleName(role) {
    const normalized = role.toUpperCase();
    return Object.values(client_1.RoleName).includes(normalized) ? normalized : null;
}
function resolvePermissions(role) {
    const roleName = normalizeRoleName(role);
    if (!roleName)
        return [];
    return exports.ROLE_PERMISSIONS[roleName] ?? [];
}
function hasPermission(role, required) {
    const permissions = resolvePermissions(role);
    if (permissions.includes(exports.Permission.SYSTEM_ALL)) {
        return true;
    }
    const requiredList = Array.isArray(required) ? required : [required];
    return requiredList.every((permission) => permissions.includes(permission));
}
function hasAnyPermission(role, required) {
    const permissions = resolvePermissions(role);
    if (permissions.includes(exports.Permission.SYSTEM_ALL)) {
        return true;
    }
    return required.some((permission) => permissions.includes(permission));
}
function isClientFacingRole(role) {
    const roleName = normalizeRoleName(role);
    return (roleName === client_1.RoleName.CLIENT || roleName === client_1.RoleName.EXTERNAL_CLIENT_CRM);
}
//# sourceMappingURL=permissions.js.map