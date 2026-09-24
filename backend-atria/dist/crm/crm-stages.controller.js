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
exports.CrmStagesController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const any_permissions_decorator_1 = require("../auth/decorators/any-permissions.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const rbac_1 = require("../auth/utils/rbac");
const lead_stage_dto_1 = require("../leads/dto/lead-stage.dto");
const lead_stages_service_1 = require("../leads/lead-stages.service");
let CrmStagesController = class CrmStagesController {
    leadStagesService;
    constructor(leadStagesService) {
        this.leadStagesService = leadStagesService;
    }
    findAll() {
        return this.leadStagesService.findAll();
    }
    create(dto) {
        return this.leadStagesService.create(dto);
    }
    reorder(dto) {
        return this.leadStagesService.reorder(dto);
    }
    update(id, dto) {
        return this.leadStagesService.update(id, dto);
    }
    remove(id) {
        return this.leadStagesService.remove(id);
    }
};
exports.CrmStagesController = CrmStagesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmStagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.RoleName.MASTER, client_1.RoleName.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lead_stage_dto_1.CreateLeadStageDto]),
    __metadata("design:returntype", void 0)
], CrmStagesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('reorder'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.MASTER, client_1.RoleName.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lead_stage_dto_1.ReorderLeadStagesDto]),
    __metadata("design:returntype", void 0)
], CrmStagesController.prototype, "reorder", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.MASTER, client_1.RoleName.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lead_stage_dto_1.UpdateLeadStageDto]),
    __metadata("design:returntype", void 0)
], CrmStagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.MASTER, client_1.RoleName.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrmStagesController.prototype, "remove", null);
exports.CrmStagesController = CrmStagesController = __decorate([
    (0, common_1.Controller)('crm/stages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, any_permissions_decorator_1.AnyPermissions)(...(0, rbac_1.getRequiredCrmPermissions)()),
    __metadata("design:paramtypes", [lead_stages_service_1.LeadStagesService])
], CrmStagesController);
//# sourceMappingURL=crm-stages.controller.js.map