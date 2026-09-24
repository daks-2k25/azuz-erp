import { PermissionKey } from '../constants/permissions';
export declare const ANY_PERMISSIONS_KEY = "any_permissions";
export declare const AnyPermissions: (...permissions: PermissionKey[]) => import("@nestjs/common").CustomDecorator<string>;
