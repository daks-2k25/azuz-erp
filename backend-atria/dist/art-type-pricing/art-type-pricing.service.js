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
exports.ArtTypePricingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ArtTypePricingService = class ArtTypePricingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const items = await this.prisma.artTypePricing.findMany({
            orderBy: { artType: 'asc' },
        });
        return items.map((item) => this.toResponse(item));
    }
    async findOne(id) {
        const item = await this.ensureExists(id);
        return this.toResponse(item);
    }
    async create(dto) {
        try {
            const item = await this.prisma.artTypePricing.create({
                data: {
                    artType: dto.artType.trim(),
                    pricePerPiece: dto.pricePerPiece,
                    description: dto.description?.trim(),
                },
            });
            return this.toResponse(item);
        }
        catch (error) {
            if (this.isUniqueConstraintError(error)) {
                throw new common_1.ConflictException('Art type already exists');
            }
            throw error;
        }
    }
    async update(id, dto) {
        await this.ensureExists(id);
        try {
            const item = await this.prisma.artTypePricing.update({
                where: { id },
                data: {
                    artType: dto.artType?.trim(),
                    pricePerPiece: dto.pricePerPiece,
                    description: dto.description?.trim(),
                },
            });
            return this.toResponse(item);
        }
        catch (error) {
            if (this.isUniqueConstraintError(error)) {
                throw new common_1.ConflictException('Art type already exists');
            }
            throw error;
        }
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.artTypePricing.delete({ where: { id } });
    }
    async ensureExists(id) {
        const item = await this.prisma.artTypePricing.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Art type pricing not found');
        return item;
    }
    toResponse(item) {
        return {
            id: item.id,
            artType: item.artType,
            pricePerPiece: Number(item.pricePerPiece),
            description: item.description,
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
exports.ArtTypePricingService = ArtTypePricingService;
exports.ArtTypePricingService = ArtTypePricingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArtTypePricingService);
//# sourceMappingURL=art-type-pricing.service.js.map