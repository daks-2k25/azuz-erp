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
exports.EmployeeProfilesService = void 0;
const common_1 = require("@nestjs/common");
const employee_profile_repository_1 = require("./ports/employee-profile.repository");
const work_schedules_service_1 = require("./work-schedules.service");
let EmployeeProfilesService = class EmployeeProfilesService {
    employeeProfiles;
    workSchedules;
    constructor(employeeProfiles, workSchedules) {
        this.employeeProfiles = employeeProfiles;
        this.workSchedules = workSchedules;
    }
    list(companyId) {
        return this.employeeProfiles.listByCompany(companyId);
    }
    findForUser(userId) {
        return this.employeeProfiles.findByUserId(userId);
    }
    async create(companyId, input) {
        await this.ensureUserIsEligible(companyId, input.userId);
        await this.ensureUserHasNoProfile(input.userId);
        await this.workSchedules.getActiveById(companyId, input.workScheduleId);
        return this.employeeProfiles.create({
            companyId,
            userId: input.userId,
            admissionDate: input.admissionDate,
            workScheduleId: input.workScheduleId,
        });
    }
    async update(companyId, employeeProfileId, input) {
        await this.getById(companyId, employeeProfileId);
        if (input.workScheduleId) {
            await this.workSchedules.getActiveById(companyId, input.workScheduleId);
        }
        return this.employeeProfiles.update(employeeProfileId, input);
    }
    async deactivate(companyId, employeeProfileId) {
        await this.getById(companyId, employeeProfileId);
        return this.employeeProfiles.update(employeeProfileId, { isActive: false });
    }
    async activate(companyId, employeeProfileId) {
        const profile = await this.getById(companyId, employeeProfileId);
        await this.workSchedules.getActiveById(companyId, profile.workScheduleId);
        return this.employeeProfiles.update(employeeProfileId, { isActive: true });
    }
    async getById(companyId, employeeProfileId) {
        const profile = await this.employeeProfiles.findById(companyId, employeeProfileId);
        if (!profile) {
            throw new common_1.NotFoundException('Cadastro de funcionário não encontrado.');
        }
        return profile;
    }
    async ensureUserIsEligible(companyId, userId) {
        const user = await this.employeeProfiles.findEligibleUser(userId);
        if (!user || user.companyId !== companyId) {
            throw new common_1.NotFoundException('Usuário não encontrado nesta empresa.');
        }
        if (!user.isActive) {
            throw new common_1.BadRequestException('O usuário está desativado.');
        }
        if (!user.isInternalMember) {
            throw new common_1.BadRequestException('Somente usuários da equipe interna podem ser cadastrados como CLT.');
        }
    }
    async ensureUserHasNoProfile(userId) {
        const existing = await this.employeeProfiles.findByUserId(userId);
        if (existing) {
            throw new common_1.ConflictException('Este usuário já possui cadastro de funcionário CLT.');
        }
    }
};
exports.EmployeeProfilesService = EmployeeProfilesService;
exports.EmployeeProfilesService = EmployeeProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employee_profile_repository_1.EmployeeProfileRepository,
        work_schedules_service_1.WorkSchedulesService])
], EmployeeProfilesService);
//# sourceMappingURL=employee-profiles.service.js.map