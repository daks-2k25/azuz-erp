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
exports.AgendaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AgendaService = class AgendaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const items = await this.prisma.agendaEvent.findMany({
            where: {
                eventDate: {
                    ...(query.from ? { gte: query.from } : {}),
                    ...(query.to ? { lte: query.to } : {}),
                },
            },
            include: { confirmations: true },
            orderBy: [{ eventDate: 'asc' }, { startTime: 'asc' }],
        });
        return items.map((item) => this.toResponse(item));
    }
    async findOne(id) {
        const item = await this.ensureExists(id);
        return this.toResponse(item);
    }
    async create(createdBy, dto) {
        const item = await this.prisma.agendaEvent.create({
            data: {
                title: dto.title.trim(),
                description: dto.description?.trim(),
                eventDate: dto.eventDate,
                startTime: dto.startTime,
                endTime: dto.endTime,
                eventType: dto.eventType.trim(),
                recurrence: dto.recurrence,
                participants: (dto.participants ?? []),
                meetingLink: dto.meetingLink,
                location: dto.location?.trim(),
                priority: dto.priority,
                status: dto.status,
                createdBy,
            },
            include: { confirmations: true },
        });
        return this.toResponse(item);
    }
    async update(id, dto) {
        await this.ensureExists(id);
        const item = await this.prisma.agendaEvent.update({
            where: { id },
            data: {
                title: dto.title?.trim(),
                description: dto.description?.trim(),
                eventDate: dto.eventDate,
                startTime: dto.startTime,
                endTime: dto.endTime,
                eventType: dto.eventType?.trim(),
                recurrence: dto.recurrence,
                participants: dto.participants !== undefined
                    ? dto.participants
                    : undefined,
                meetingLink: dto.meetingLink,
                location: dto.location?.trim(),
                priority: dto.priority,
                status: dto.status,
            },
            include: { confirmations: true },
        });
        return this.toResponse(item);
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.agendaEvent.delete({ where: { id } });
    }
    async confirm(id, dto) {
        await this.ensureExists(id);
        try {
            const confirmation = await this.prisma.agendaConfirmation.create({
                data: {
                    eventId: id,
                    userId: dto.userId,
                },
            });
            return this.toConfirmationResponse(confirmation);
        }
        catch (error) {
            if (this.isUniqueConstraintError(error)) {
                throw new common_1.ConflictException('User already confirmed this event');
            }
            throw error;
        }
    }
    async removeConfirmation(id, userId) {
        await this.ensureExists(id);
        const confirmation = await this.prisma.agendaConfirmation.findUnique({
            where: { eventId_userId: { eventId: id, userId } },
        });
        if (!confirmation) {
            throw new common_1.NotFoundException('Confirmation not found');
        }
        await this.prisma.agendaConfirmation.delete({
            where: { id: confirmation.id },
        });
    }
    async ensureExists(id) {
        const item = await this.prisma.agendaEvent.findUnique({
            where: { id },
            include: { confirmations: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Agenda event not found');
        return item;
    }
    toConfirmationResponse(confirmation) {
        return {
            id: confirmation.id,
            eventId: confirmation.eventId,
            userId: confirmation.userId,
            confirmedAt: confirmation.confirmedAt.toISOString(),
            createdAt: confirmation.createdAt.toISOString(),
            updatedAt: confirmation.updatedAt.toISOString(),
        };
    }
    toResponse(item) {
        return {
            id: item.id,
            title: item.title,
            description: item.description,
            eventDate: item.eventDate,
            startTime: item.startTime,
            endTime: item.endTime,
            eventType: item.eventType,
            recurrence: item.recurrence,
            participants: item.participants,
            meetingLink: item.meetingLink,
            location: item.location,
            priority: item.priority,
            status: item.status,
            createdBy: item.createdBy,
            confirmations: (item.confirmations ?? []).map((c) => this.toConfirmationResponse(c)),
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
    isUniqueConstraintError(error) {
        return (typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 'P2002');
    }
};
exports.AgendaService = AgendaService;
exports.AgendaService = AgendaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgendaService);
//# sourceMappingURL=agenda.service.js.map