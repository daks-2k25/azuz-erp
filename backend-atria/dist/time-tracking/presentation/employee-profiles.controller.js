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
exports.EmployeeProfilesController = void 0;
const common_1 = require("@nestjs/common");
const permissions_1 = require("../../auth/constants/permissions");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const company_scope_1 = require("../application/company-scope");
const employee_profiles_service_1 = require("../application/employee-profiles.service");
const employee_profile_dto_1 = require("./dto/employee-profile.dto");
const time_tracking_mappers_1 = require("./time-tracking.mappers");
let EmployeeProfilesController = class EmployeeProfilesController {
    employeeProfiles;
    constructor(employeeProfiles) {
        this.employeeProfiles = employeeProfiles;
    }
    async list(user) {
        const profiles = await this.employeeProfiles.list((0, company_scope_1.resolveCompanyId)(user.companyId));
        return profiles.map(time_tracking_mappers_1.toEmployeeProfileResponse);
    }
    async create(user, dto) {
        const profile = await this.employeeProfiles.create((0, company_scope_1.resolveCompanyId)(user.companyId), {
            userId: dto.userId,
            admissionDate: (0, time_tracking_mappers_1.parseCalendarDate)(dto.admissionDate),
            workScheduleId: dto.workScheduleId,
        });
        return (0, time_tracking_mappers_1.toEmployeeProfileResponse)(profile);
    }
    async update(user, employeeProfileId, dto) {
        const profile = await this.employeeProfiles.update((0, company_scope_1.resolveCompanyId)(user.companyId), employeeProfileId, {
            admissionDate: dto.admissionDate
                ? (0, time_tracking_mappers_1.parseCalendarDate)(dto.admissionDate)
                : undefined,
            workScheduleId: dto.workScheduleId,
        });
        return (0, time_tracking_mappers_1.toEmployeeProfileResponse)(profile);
    }
    async deactivate(user, employeeProfileId) {
        const profile = await this.employeeProfiles.deactivate((0, company_scope_1.resolveCompanyId)(user.companyId), employeeProfileId);
        return (0, time_tracking_mappers_1.toEmployeeProfileResponse)(profile);
    }
    async activate(user, employeeProfileId) {
        const profile = await this.employeeProfiles.activate((0, company_scope_1.resolveCompanyId)(user.companyId), employeeProfileId);
        return (0, time_tracking_mappers_1.toEmployeeProfileResponse)(profile);
    }
};
exports.EmployeeProfilesController = EmployeeProfilesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfilesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, employee_profile_dto_1.CreateEmployeeProfileDto]),
    __metadata("design:returntype", Promise)
], EmployeeProfilesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, employee_profile_dto_1.UpdateEmployeeProfileDto]),
    __metadata("design:returntype", Promise)
], EmployeeProfilesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmployeeProfilesController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmployeeProfilesController.prototype, "activate", null);
exports.EmployeeProfilesController = EmployeeProfilesController = __decorate([
    (0, common_1.Controller)('time-tracking/employees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)(permissions_1.Permission.TIMECLOCK_MANAGE),
    __metadata("design:paramtypes", [employee_profiles_service_1.EmployeeProfilesService])
], EmployeeProfilesController);
//# sourceMappingURL=employee-profiles.controller.js.map