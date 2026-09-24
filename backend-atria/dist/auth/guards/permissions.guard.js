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
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_1 = require("../constants/permissions");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const any_permissions_decorator_1 = require("../decorators/any-permissions.decorator");
let PermissionsGuard = class PermissionsGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const anyPermissions = this.reflector.getAllAndOverride(any_permissions_decorator_1.ANY_PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!anyPermissions?.length && !requiredPermissions?.length) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user?.role) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (anyPermissions?.length) {
            const allowed = (0, permissions_1.hasAnyPermission)(user.role, anyPermissions);
            if (!allowed) {
                throw new common_1.ForbiddenException('Insufficient permissions');
            }
            return true;
        }
        const allowed = requiredPermissions.every((permission) => (0, permissions_1.hasPermission)(user.role, permission));
        if (!allowed) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map