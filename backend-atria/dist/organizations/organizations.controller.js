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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const permissions_1 = require("../auth/constants/permissions");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const update_crm_status_dto_1 = require("./dto/update-crm-status.dto");
const update_sdr_assignments_dto_1 = require("./dto/update-sdr-assignments.dto");
const organizations_service_1 = require("./organizations.service");
let OrganizationsController = class OrganizationsController {
    organizationsService;
    constructor(organizationsService) {
        this.organizationsService = organizationsService;
    }
    getOrganization(id) {
        return this.organizationsService.getOrganization(id);
    }
    updateCrmStatus(id, dto) {
        return this.organizationsService.updateCrmStatus(id, dto.hasCrmEnabled);
    }
    replaceSdrAssignments(id, dto) {
        return this.organizationsService.replaceSdrAssignments(id, dto.sdrUserIds);
    }
};
exports.OrganizationsController = OrganizationsController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "getOrganization", null);
__decorate([
    (0, common_1.Patch)(':id/crm-status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_crm_status_dto_1.UpdateOrganizationCrmStatusDto]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "updateCrmStatus", null);
__decorate([
    (0, common_1.Put)(':id/sdr-assignments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sdr_assignments_dto_1.UpdateOrganizationSdrAssignmentsDto]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "replaceSdrAssignments", null);
exports.OrganizationsController = OrganizationsController = __decorate([
    (0, common_1.Controller)('organizations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.Roles)(client_1.RoleName.MASTER, client_1.RoleName.ADMIN),
    (0, permissions_decorator_1.Permissions)(permissions_1.Permission.SETTINGS_MANAGE),
    __metadata("design:paramtypes", [organizations_service_1.OrganizationsService])
], OrganizationsController);
//# sourceMappingURL=organizations.controller.js.map