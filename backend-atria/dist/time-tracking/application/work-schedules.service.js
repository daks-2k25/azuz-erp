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
exports.WorkSchedulesService = void 0;
const common_1 = require("@nestjs/common");
const work_schedule_1 = require("../domain/work-schedule");
const work_schedule_repository_1 = require("./ports/work-schedule.repository");
let WorkSchedulesService = class WorkSchedulesService {
    workSchedules;
    constructor(workSchedules) {
        this.workSchedules = workSchedules;
    }
    list(companyId) {
        return this.workSchedules.listByCompany(companyId);
    }
    async getById(companyId, workScheduleId) {
        const workSchedule = await this.workSchedules.findById(companyId, workScheduleId);
        if (!workSchedule) {
            throw new common_1.NotFoundException('Jornada não encontrada.');
        }
        return workSchedule;
    }
    async getActiveById(companyId, workScheduleId) {
        const workSchedule = await this.getById(companyId, workScheduleId);
        if (!workSchedule.isActive) {
            throw new common_1.BadRequestException('A jornada selecionada está inativa.');
        }
        return workSchedule;
    }
    async create(companyId, input) {
        const name = input.name.trim();
        const reminderToleranceMinutes = input.reminderToleranceMinutes ?? work_schedule_1.DEFAULT_REMINDER_TOLERANCE_MINUTES;
        this.validateRules(input.days, reminderToleranceMinutes);
        await this.ensureNameIsAvailable(companyId, name);
        return this.workSchedules.create({
            companyId,
            name,
            reminderToleranceMinutes,
            days: input.days,
        });
    }
    async update(companyId, workScheduleId, input) {
        const current = await this.getById(companyId, workScheduleId);
        const name = input.name?.trim();
        this.validateRules(input.days ?? current.days, input.reminderToleranceMinutes ?? current.reminderToleranceMinutes);
        if (name && name !== current.name) {
            await this.ensureNameIsAvailable(companyId, name, workScheduleId);
        }
        return this.workSchedules.update(workScheduleId, {
            name,
            reminderToleranceMinutes: input.reminderToleranceMinutes,
            days: input.days,
        });
    }
    async deactivate(companyId, workScheduleId) {
        await this.getById(companyId, workScheduleId);
        const activeEmployees = await this.workSchedules.countActiveEmployees(workScheduleId);
        if (activeEmployees > 0) {
            throw new common_1.ConflictException(`Esta jornada está em uso por ${activeEmployees} funcionário(s) ativo(s). Troque a jornada deles antes de desativá-la.`);
        }
        return this.workSchedules.update(workScheduleId, { isActive: false });
    }
    async activate(companyId, workScheduleId) {
        await this.getById(companyId, workScheduleId);
        return this.workSchedules.update(workScheduleId, { isActive: true });
    }
    validateRules(days, reminderToleranceMinutes) {
        try {
            (0, work_schedule_1.assertValidWorkScheduleDays)(days);
            (0, work_schedule_1.assertValidReminderTolerance)(reminderToleranceMinutes);
        }
        catch (error) {
            if (error instanceof work_schedule_1.InvalidWorkScheduleError) {
                throw new common_1.BadRequestException(error.message);
            }
            throw error;
        }
    }
    async ensureNameIsAvailable(companyId, name, ignoreWorkScheduleId) {
        const nameIsTaken = await this.workSchedules.existsWithName(companyId, name, ignoreWorkScheduleId);
        if (nameIsTaken) {
            throw new common_1.ConflictException(`Já existe uma jornada chamada "${name}".`);
        }
    }
};
exports.WorkSchedulesService = WorkSchedulesService;
exports.WorkSchedulesService = WorkSchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [work_schedule_repository_1.WorkScheduleRepository])
], WorkSchedulesService);
//# sourceMappingURL=work-schedules.service.js.map