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
exports.CalendarEntriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const clientSelect = {
    select: { id: true, companyName: true },
};
let CalendarEntriesService = class CalendarEntriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const items = await this.prisma.calendarEntry.findMany({
            where: {
                year: query.year,
                month: query.month,
                clientId: query.clientId,
            },
            include: { client: clientSelect },
            orderBy: [{ year: 'desc' }, { month: 'desc' }, { plannedDate: 'asc' }],
        });
        return items.map((item) => this.toResponse(item));
    }
    async findOne(id) {
        const item = await this.ensureExists(id);
        return this.toResponse(item);
    }
    async create(dto) {
        const item = await this.prisma.calendarEntry.create({
            data: {
                month: dto.month,
                year: dto.year,
                clientId: dto.clientId,
                artType: dto.artType.trim(),
                plannedDate: dto.plannedDate,
                designerId: dto.designerId,
                title: dto.title.trim(),
                description: dto.description?.trim(),
                taskId: dto.taskId,
                productionDeadline: dto.productionDeadline,
                storyQuantity: dto.storyQuantity,
            },
            include: { client: clientSelect },
        });
        return this.toResponse(item);
    }
    async update(id, dto) {
        await this.ensureExists(id);
        const item = await this.prisma.calendarEntry.update({
            where: { id },
            data: {
                month: dto.month,
                year: dto.year,
                clientId: dto.clientId,
                artType: dto.artType?.trim(),
                plannedDate: dto.plannedDate,
                designerId: dto.designerId,
                title: dto.title?.trim(),
                description: dto.description?.trim(),
                taskId: dto.taskId,
                productionDeadline: dto.productionDeadline,
                storyQuantity: dto.storyQuantity,
            },
            include: { client: clientSelect },
        });
        return this.toResponse(item);
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.calendarEntry.delete({ where: { id } });
    }
    async ensureExists(id) {
        const item = await this.prisma.calendarEntry.findUnique({
            where: { id },
            include: { client: clientSelect },
        });
        if (!item)
            throw new common_1.NotFoundException('Calendar entry not found');
        return item;
    }
    toResponse(item) {
        return {
            id: item.id,
            month: item.month,
            year: item.year,
            clientId: item.clientId,
            client: item.client
                ? { id: item.client.id, companyName: item.client.companyName }
                : null,
            artType: item.artType,
            plannedDate: item.plannedDate,
            designerId: item.designerId,
            title: item.title,
            description: item.description,
            taskId: item.taskId,
            productionDeadline: item.productionDeadline,
            storyQuantity: item.storyQuantity,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
};
exports.CalendarEntriesService = CalendarEntriesService;
exports.CalendarEntriesService = CalendarEntriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalendarEntriesService);
//# sourceMappingURL=calendar-entries.service.js.map