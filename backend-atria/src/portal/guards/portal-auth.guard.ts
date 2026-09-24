import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PortalAuthService } from '../portal-auth.service';

@Injectable()
export class PortalAuthGuard implements CanActivate {
  constructor(private readonly portalAuthService: PortalAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      portalUser?: { id: string; clientId: string; email: string };
    }>();

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Portal authentication required');
    }

    const token = authHeader.slice(7);
    const portalUser =
      await this.portalAuthService.getPortalUserFromAccessToken(token);
    request.portalUser = portalUser;
    return true;
  }
}
