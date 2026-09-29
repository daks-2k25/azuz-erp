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
exports.MyEmployeeProfileController = void 0;
const common_1 = require("@nestjs/common");
const allow_authenticated_decorator_1 = require("../../auth/decorators/allow-authenticated.decorator");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const employee_profiles_service_1 = require("../application/employee-profiles.service");
const time_tracking_mappers_1 = require("./time-tracking.mappers");
let MyEmployeeProfileController = class MyEmployeeProfileController {
    employeeProfiles;
    constructor(employeeProfiles) {
        this.employeeProfiles = employeeProfiles;
    }
    async getProfile(user) {
        const profile = await this.employeeProfiles.findForUser(user.userId);
        return { profile: profile ? (0, time_tracking_mappers_1.toEmployeeProfileResponse)(profile) : null };
    }
};
exports.MyEmployeeProfileController = MyEmployeeProfileController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MyEmployeeProfileController.prototype, "getProfile", null);
exports.MyEmployeeProfileController = MyEmployeeProfileController = __decorate([
    (0, common_1.Controller)('time-tracking/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, allow_authenticated_decorator_1.AllowAuthenticated)(),
    __metadata("design:paramtypes", [employee_profiles_service_1.EmployeeProfilesService])
], MyEmployeeProfileController);
//# sourceMappingURL=my-employee-profile.controller.js.map