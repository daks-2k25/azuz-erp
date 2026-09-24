import { PermissionKey } from '../constants/permissions';
export declare const PERMISSIONS_KEY = "permissions";
export declare const Permissions: (...permissions: PermissionKey[]) => import("@nestjs/common").CustomDecorator<string>;
