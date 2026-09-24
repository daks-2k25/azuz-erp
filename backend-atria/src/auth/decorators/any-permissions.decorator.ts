import { SetMetadata } from '@nestjs/common';
import { PermissionKey } from '../constants/permissions';

export const ANY_PERMISSIONS_KEY = 'any_permissions';

export const AnyPermissions = (...permissions: PermissionKey[]) =>
  SetMetadata(ANY_PERMISSIONS_KEY, permissions);
