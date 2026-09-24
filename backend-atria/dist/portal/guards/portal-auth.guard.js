"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const portal_auth_service_1 = require("../portal-auth.service");
let PortalAuthGuard = class PortalAuthGuard {
    portalAuthService;
    constructor(portalAuthService) {
        this.portalAuthService = portalAuthService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Portal authentication required');
        }
        const token = authHeader.slice(7);
        const portalUser = await this.portalAuthService.getPortalUserFromAccessToken(token);
        request.portalUser = portalUser;
        return true;
    }
};
exports.PortalAuthGuard = PortalAuthGuard;
exports.PortalAuthGuard = PortalAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [portal_auth_service_1.PortalAuthService])
], PortalAuthGuard);
//# sourceMappingURL=portal-auth.guard.js.map