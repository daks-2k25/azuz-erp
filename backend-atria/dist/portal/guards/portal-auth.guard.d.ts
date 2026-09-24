import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PortalAuthService } from '../portal-auth.service';
export declare class PortalAuthGuard implements CanActivate {
    private readonly portalAuthService;
    constructor(portalAuthService: PortalAuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
