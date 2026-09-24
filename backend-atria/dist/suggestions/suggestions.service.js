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
exports.SuggestionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const permissions_1 = require("../auth/constants/permissions");
const prisma_service_1 = require("../prisma/prisma.service");
let SuggestionsService = class SuggestionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, companyId, dto) {
        const suggestion = await this.prisma.systemSuggestion.create({
            data: {
                type: dto.type,
                title: dto.title.trim(),
                description: dto.description.trim(),
                submittedById: userId,
                companyId: companyId ?? '00000000-0000-4000-8000-000000000001',
            },
            include: {
                submittedBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return this.toResponse(suggestion);
    }
    async findMine(userId, companyId) {
        const items = await this.prisma.systemSuggestion.findMany({
            where: {
                submittedById: userId,
                ...(companyId ? { companyId } : {}),
            },
            include: {
                submittedBy: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return items.map((item) => this.toResponse(item));
    }
    async findAll(companyId) {
        const items = await this.prisma.systemSuggestion.findMany({
            where: companyId ? { companyId } : {},
            include: {
                submittedBy: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return items.map((item) => this.toResponse(item));
    }
    async updateStatus(id, role, companyId, dto) {
        this.assertMasterRole(role);
        const suggestion = await this.prisma.systemSuggestion.findFirst({
            where: {
                id,
                ...(companyId ? { companyId } : {}),
            },
        });
        if (!suggestion) {
            throw new common_1.NotFoundException('Suggestion not found');
        }
        const updated = await this.prisma.systemSuggestion.update({
            where: { id },
            data: { status: dto.status },
            include: {
                submittedBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return this.toResponse(updated);
    }
    assertMasterRole(role) {
        if ((0, permissions_1.normalizeRoleName)(role) !== client_1.RoleName.MASTER) {
            throw new common_1.ForbiddenException('Only MASTER users can view all suggestions');
        }
    }
    toResponse(item) {
        return {
            id: item.id,
            type: item.type,
            title: item.title,
            description: item.description,
            status: item.status,
            submittedById: item.submittedById,
            submittedBy: item.submittedBy,
            companyId: item.companyId,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
};
exports.SuggestionsService = SuggestionsService;
exports.SuggestionsService = SuggestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuggestionsService);
//# sourceMappingURL=suggestions.service.js.map