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
exports.PrismaWorkScheduleRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const work_schedule_repository_1 = require("../application/ports/work-schedule.repository");
const work_schedule_day_mapper_1 = require("./work-schedule-day.mapper");
const WORK_SCHEDULE_INCLUDE = {
    days: { orderBy: { weekday: 'asc' } },
};
let PrismaWorkScheduleRepository = class PrismaWorkScheduleRepository extends work_schedule_repository_1.WorkScheduleRepository {
    prisma;
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async listByCompany(companyId) {
        const records = await this.prisma.workSchedule.findMany({
            where: { companyId },
            include: WORK_SCHEDULE_INCLUDE,
            orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
        });
        return records.map(toWorkSchedule);
    }
    async findById(companyId, workScheduleId) {
        const record = await this.prisma.workSchedule.findFirst({
            where: { id: workScheduleId, companyId },
            include: WORK_SCHEDULE_INCLUDE,
        });
        return record ? toWorkSchedule(record) : null;
    }
    async existsWithName(companyId, name, ignoreWorkScheduleId) {
        const count = await this.prisma.workSchedule.count({
            where: {
                companyId,
                name: { equals: name, mode: 'insensitive' },
                ...(ignoreWorkScheduleId ? { id: { not: ignoreWorkScheduleId } } : {}),
            },
        });
        return count > 0;
    }
    countActiveEmployees(workScheduleId) {
        return this.prisma.employeeProfile.count({
            where: { workScheduleId, isActive: true },
        });
    }
    async create(data) {
        const record = await this.prisma.workSchedule.create({
            data: {
                companyId: data.companyId,
                name: data.name,
                reminderToleranceMinutes: data.reminderToleranceMinutes,
                days: { create: data.days.map(toDayCreateInput) },
            },
            include: WORK_SCHEDULE_INCLUDE,
        });
        return toWorkSchedule(record);
    }
    async update(workScheduleId, data) {
        const record = await this.prisma.$transaction(async (transaction) => {
            if (data.days) {
                await transaction.workScheduleDay.deleteMany({
                    where: { workScheduleId },
                });
            }
            return transaction.workSchedule.update({
                where: { id: workScheduleId },
                data: {
                    name: data.name,
                    reminderToleranceMinutes: data.reminderToleranceMinutes,
                    isActive: data.isActive,
                    ...(data.days
                        ? { days: { create: data.days.map(toDayCreateInput) } }
                        : {}),
                },
                include: WORK_SCHEDULE_INCLUDE,
            });
        });
        return toWorkSchedule(record);
    }
};
exports.PrismaWorkScheduleRepository = PrismaWorkScheduleRepository;
exports.PrismaWorkScheduleRepository = PrismaWorkScheduleRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaWorkScheduleRepository);
function toDayCreateInput(day) {
    return {
        weekday: day.weekday,
        startMinutes: day.startMinutes,
        breakStartMinutes: day.breakStartMinutes,
        breakEndMinutes: day.breakEndMinutes,
        endMinutes: day.endMinutes,
    };
}
function toWorkSchedule(record) {
    return {
        id: record.id,
        companyId: record.companyId,
        name: record.name,
        reminderToleranceMinutes: record.reminderToleranceMinutes,
        isActive: record.isActive,
        days: record.days.map(work_schedule_day_mapper_1.toWorkScheduleDay),
    };
}
//# sourceMappingURL=prisma-work-schedule.repository.js.map