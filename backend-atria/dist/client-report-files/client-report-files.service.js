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
exports.ClientReportFilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const clientSelect = {
    select: { id: true, companyName: true },
};
let ClientReportFilesService = class ClientReportFilesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const items = await this.prisma.clientReportFile.findMany({
            where: {
                clientId: query.clientId,
                status: query.status,
            },
            include: { client: clientSelect },
            orderBy: { createdAt: 'desc' },
        });
        return items.map((item) => this.toResponse(item));
    }
    async findOne(id) {
        const item = await this.ensureExists(id);
        return this.toResponse(item);
    }
    async create(dto) {
        const item = await this.prisma.clientReportFile.create({
            data: {
                clientId: dto.clientId,
                title: dto.title.trim(),
                fileUrl: dto.fileUrl,
                fileType: dto.fileType.trim(),
                uploadedBy: dto.uploadedBy,
                status: dto.status,
            },
            include: { client: clientSelect },
        });
        return this.toResponse(item);
    }
    async update(id, dto) {
        await this.ensureExists(id);
        const item = await this.prisma.clientReportFile.update({
            where: { id },
            data: {
                clientId: dto.clientId,
                title: dto.title?.trim(),
                fileUrl: dto.fileUrl,
                fileType: dto.fileType?.trim(),
                uploadedBy: dto.uploadedBy,
                status: dto.status,
            },
            include: { client: clientSelect },
        });
        return this.toResponse(item);
    }
    async approve(id, dto) {
        await this.ensureExists(id);
        const item = await this.prisma.clientReportFile.update({
            where: { id },
            data: {
                status: 'approved',
                approvedAt: new Date(),
                approvedBy: dto.approvedBy,
            },
            include: { client: clientSelect },
        });
        return this.toResponse(item);
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.clientReportFile.delete({ where: { id } });
    }
    async ensureExists(id) {
        const item = await this.prisma.clientReportFile.findUnique({
            where: { id },
            include: { client: clientSelect },
        });
        if (!item)
            throw new common_1.NotFoundException('Client report file not found');
        return item;
    }
    toResponse(item) {
        return {
            id: item.id,
            clientId: item.clientId,
            client: item.client
                ? { id: item.client.id, companyName: item.client.companyName }
                : null,
            title: item.title,
            fileUrl: item.fileUrl,
            fileType: item.fileType,
            uploadedBy: item.uploadedBy,
            status: item.status,
            approvedAt: item.approvedAt?.toISOString() ?? null,
            approvedBy: item.approvedBy,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
};
exports.ClientReportFilesService = ClientReportFilesService;
exports.ClientReportFilesService = ClientReportFilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientReportFilesService);
//# sourceMappingURL=client-report-files.service.js.map