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
exports.SlaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const company_constants_1 = require("../company/company.constants");
const sla_utils_1 = require("./sla.utils");
const userSelect = { id: true, name: true, avatarUrl: true };
let SlaService = class SlaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        const settings = await this.ensureAgencySettings();
        return (0, sla_utils_1.toSlaSettingsResponse)(settings);
    }
    async updateSettings(dto) {
        const companyId = company_constants_1.DEFAULT_COMPANY_ID;
        const settings = await this.prisma.agencySettings.update({
            where: { companyId },
            data: dto,
        });
        return (0, sla_utils_1.toSlaSettingsResponse)(settings);
    }
    async getSettingsForComputation() {
        const settings = await this.ensureAgencySettings();
        return (0, sla_utils_1.toSlaSettingsResponse)(settings);
    }
    async computeDueDatesForPriority(priority, createdAt) {
        const settings = await this.getSettingsForComputation();
        return (0, sla_utils_1.computeSlaDueDates)(priority, createdAt, settings);
    }
    computeTaskSlaStatus(task) {
        return (0, sla_utils_1.computeSlaStatus)({
            createdAt: task.createdAt,
            slaResponseDueAt: task.slaResponseDueAt,
            slaResolutionDueAt: task.slaResolutionDueAt,
            firstResponseAt: task.firstResponseAt,
            resolvedAt: task.resolvedAt,
            isDone: task.column?.type === client_1.KanbanColumnType.DONE,
        });
    }
    computeBriefSlaStatus(brief) {
        const isDone = brief.status === client_1.ClientBriefStatus.RESOLVED ||
            brief.status === client_1.ClientBriefStatus.CLOSED;
        return (0, sla_utils_1.computeSlaStatus)({
            createdAt: brief.createdAt,
            slaResponseDueAt: brief.slaResponseDueAt,
            slaResolutionDueAt: brief.slaResolutionDueAt,
            firstResponseAt: brief.firstResponseAt,
            resolvedAt: brief.resolvedAt,
            isDone,
        });
    }
    async getDashboard() {
        const now = new Date();
        const doneColumns = await this.prisma.kanbanColumn.findMany({
            where: { type: client_1.KanbanColumnType.DONE },
            select: { id: true },
        });
        const doneColumnIds = doneColumns.map((c) => c.id);
        const openTasks = await this.prisma.kanbanTask.findMany({
            where: {
                columnId: { notIn: doneColumnIds },
                OR: [
                    { slaResponseDueAt: { not: null } },
                    { slaResolutionDueAt: { not: null } },
                ],
            },
            include: {
                column: true,
                client: { select: { id: true, companyName: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
        const openBriefs = await this.prisma.clientBrief.findMany({
            where: {
                status: { in: [client_1.ClientBriefStatus.OPEN, client_1.ClientBriefStatus.IN_PROGRESS] },
            },
            include: {
                client: { select: { id: true, companyName: true } },
                assignedTo: { select: userSelect },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        const taskItems = openTasks.map((task) => {
            const slaStatus = this.computeTaskSlaStatus(task);
            return {
                id: task.id,
                type: 'task',
                title: task.title,
                clientName: task.client?.companyName ?? null,
                priority: task.priority.toLowerCase(),
                slaStatus,
                slaResponseDueAt: task.slaResponseDueAt?.toISOString() ?? null,
                slaResolutionDueAt: task.slaResolutionDueAt?.toISOString() ?? null,
                firstResponseAt: task.firstResponseAt?.toISOString() ?? null,
                resolvedAt: task.resolvedAt?.toISOString() ?? null,
                createdAt: task.createdAt.toISOString(),
            };
        });
        const briefItems = openBriefs.map((brief) => {
            const slaStatus = this.computeBriefSlaStatus(brief);
            return {
                id: brief.id,
                type: 'brief',
                title: brief.title,
                clientName: brief.client.companyName,
                priority: brief.priority.toLowerCase(),
                status: brief.status.toLowerCase(),
                assignee: brief.assignedTo,
                slaStatus,
                slaResponseDueAt: brief.slaResponseDueAt?.toISOString() ?? null,
                slaResolutionDueAt: brief.slaResolutionDueAt?.toISOString() ?? null,
                firstResponseAt: brief.firstResponseAt?.toISOString() ?? null,
                resolvedAt: brief.resolvedAt?.toISOString() ?? null,
                createdAt: brief.createdAt.toISOString(),
            };
        });
        const breached = [...taskItems, ...briefItems].filter((item) => item.slaStatus === 'response_breached' ||
            item.slaStatus === 'resolution_breached');
        const atRisk = [...taskItems, ...briefItems].filter((item) => item.slaStatus === 'approaching_response' ||
            item.slaStatus === 'approaching_resolution');
        return {
            summary: {
                openTasks: taskItems.length,
                openBriefs: briefItems.length,
                breachedCount: breached.length,
                atRiskCount: atRisk.length,
            },
            breached,
            atRisk,
            tasks: taskItems,
            briefs: briefItems,
        };
    }
    async updateBrief(id, dto) {
        const existing = await this.prisma.clientBrief.findUnique({
            where: { id },
        });
        if (!existing)
            throw new common_1.NotFoundException('Brief not found');
        if (dto.assignedToId) {
            const user = await this.prisma.user.findUnique({
                where: { id: dto.assignedToId },
            });
            if (!user)
                throw new common_1.NotFoundException('Assignee not found');
        }
        const now = new Date();
        const data = {};
        if (dto.status !== undefined)
            data.status = dto.status;
        if (dto.priority !== undefined) {
            data.priority = dto.priority;
            const dueDates = await this.computeDueDatesForPriority(dto.priority, existing.createdAt);
            data.slaResponseDueAt = dueDates.slaResponseDueAt;
            data.slaResolutionDueAt = dueDates.slaResolutionDueAt;
        }
        if (dto.assignedToId !== undefined) {
            data.assignedToId = dto.assignedToId;
            if (dto.assignedToId && !existing.firstResponseAt) {
                data.firstResponseAt = now;
            }
        }
        if (dto.status === client_1.ClientBriefStatus.RESOLVED ||
            dto.status === client_1.ClientBriefStatus.CLOSED) {
            data.resolvedAt = now;
        }
        const brief = await this.prisma.clientBrief.update({
            where: { id },
            data,
            include: {
                client: { select: { id: true, companyName: true } },
                assignedTo: { select: userSelect },
            },
        });
        const slaStatus = this.computeBriefSlaStatus(brief);
        return {
            id: brief.id,
            title: brief.title,
            content: brief.content,
            clientId: brief.clientId,
            clientName: brief.client.companyName,
            status: brief.status.toLowerCase(),
            priority: brief.priority.toLowerCase(),
            assignedTo: brief.assignedTo,
            slaStatus,
            slaResponseDueAt: brief.slaResponseDueAt?.toISOString() ?? null,
            slaResolutionDueAt: brief.slaResolutionDueAt?.toISOString() ?? null,
            firstResponseAt: brief.firstResponseAt?.toISOString() ?? null,
            resolvedAt: brief.resolvedAt?.toISOString() ?? null,
            createdAt: brief.createdAt.toISOString(),
            updatedAt: brief.updatedAt.toISOString(),
        };
    }
    async ensureAgencySettings() {
        const companyId = company_constants_1.DEFAULT_COMPANY_ID;
        return this.prisma.agencySettings.upsert({
            where: { companyId },
            create: {
                companyId,
                ...sla_utils_1.DEFAULT_SLA_SETTINGS,
            },
            update: {},
        });
    }
};
exports.SlaService = SlaService;
exports.SlaService = SlaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SlaService);
//# sourceMappingURL=sla.service.js.map