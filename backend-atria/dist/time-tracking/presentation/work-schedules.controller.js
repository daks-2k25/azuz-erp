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
exports.WorkSchedulesController = void 0;
const common_1 = require("@nestjs/common");
const permissions_1 = require("../../auth/constants/permissions");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const company_scope_1 = require("../application/company-scope");
const work_schedules_service_1 = require("../application/work-schedules.service");
const work_schedule_dto_1 = require("./dto/work-schedule.dto");
const time_tracking_mappers_1 = require("./time-tracking.mappers");
let WorkSchedulesController = class WorkSchedulesController {
    workSchedules;
    constructor(workSchedules) {
        this.workSchedules = workSchedules;
    }
    async list(user) {
        const schedules = await this.workSchedules.list((0, company_scope_1.resolveCompanyId)(user.companyId));
        return schedules.map(time_tracking_mappers_1.toWorkScheduleResponse);
    }
    async getById(user, workScheduleId) {
        const schedule = await this.workSchedules.getById((0, company_scope_1.resolveCompanyId)(user.companyId), workScheduleId);
        return (0, time_tracking_mappers_1.toWorkScheduleResponse)(schedule);
    }
    async create(user, dto) {
        const schedule = await this.workSchedules.create((0, company_scope_1.resolveCompanyId)(user.companyId), {
            name: dto.name,
            reminderToleranceMinutes: dto.reminderToleranceMinutes,
            days: (0, time_tracking_mappers_1.toWorkScheduleDays)(dto.days),
        });
        return (0, time_tracking_mappers_1.toWorkScheduleResponse)(schedule);
    }
    async update(user, workScheduleId, dto) {
        const schedule = await this.workSchedules.update((0, company_scope_1.resolveCompanyId)(user.companyId), workScheduleId, {
            name: dto.name,
            reminderToleranceMinutes: dto.reminderToleranceMinutes,
            days: dto.days ? (0, time_tracking_mappers_1.toWorkScheduleDays)(dto.days) : undefined,
        });
        return (0, time_tracking_mappers_1.toWorkScheduleResponse)(schedule);
    }
    async deactivate(user, workScheduleId) {
        const schedule = await this.workSchedules.deactivate((0, company_scope_1.resolveCompanyId)(user.companyId), workScheduleId);
        return (0, time_tracking_mappers_1.toWorkScheduleResponse)(schedule);
    }
    async activate(user, workScheduleId) {
        const schedule = await this.workSchedules.activate((0, company_scope_1.resolveCompanyId)(user.companyId), workScheduleId);
        return (0, time_tracking_mappers_1.toWorkScheduleResponse)(schedule);
    }
};
exports.WorkSchedulesController = WorkSchedulesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkSchedulesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkSchedulesController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, work_schedule_dto_1.CreateWorkScheduleDto]),
    __metadata("design:returntype", Promise)
], WorkSchedulesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, work_schedule_dto_1.UpdateWorkScheduleDto]),
    __metadata("design:returntype", Promise)
], WorkSchedulesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkSchedulesController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkSchedulesController.prototype, "activate", null);
exports.WorkSchedulesController = WorkSchedulesController = __decorate([
    (0, common_1.Controller)('time-tracking/work-schedules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)(permissions_1.Permission.TIMECLOCK_MANAGE),
    __metadata("design:paramtypes", [work_schedules_service_1.WorkSchedulesService])
], WorkSchedulesController);
//# sourceMappingURL=work-schedules.controller.js.map