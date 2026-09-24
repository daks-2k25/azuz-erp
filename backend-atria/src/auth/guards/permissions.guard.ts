import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasAnyPermission, hasPermission } from '../constants/permissions';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ANY_PERMISSIONS_KEY } from '../decorators/any-permissions.decorator';
import { AuthenticatedUser } from '../decorators/current-user.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const anyPermissions = this.reflector.getAllAndOverride<string[]>(
      ANY_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!anyPermissions?.length && !requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: AuthenticatedUser;
    }>();
    const user = request.user;

    if (!user?.role) {
      throw new ForbiddenException('Access denied');
    }

    if (anyPermissions?.length) {
      const allowed = hasAnyPermission(user.role, anyPermissions as never);
      if (!allowed) {
        throw new ForbiddenException('Insufficient permissions');
      }
      return true;
    }

    const allowed = requiredPermissions.every((permission) =>
      hasPermission(user.role, permission as never),
    );

    if (!allowed) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
