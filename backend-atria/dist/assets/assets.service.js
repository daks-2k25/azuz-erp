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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const prisma_service_1 = require("../prisma/prisma.service");
const clientSelect = {
    id: true,
    companyName: true,
    avatarUrl: true,
};
const assetInclude = {
    client: { select: clientSelect },
    uploadedBy: { select: { id: true, name: true, avatarUrl: true } },
};
const ALLOWED_MIME = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);
let AssetsService = class AssetsService {
    prisma;
    uploadDir = (0, path_1.join)(process.cwd(), 'uploads');
    constructor(prisma) {
        this.prisma = prisma;
        if (!(0, fs_1.existsSync)(this.uploadDir)) {
            (0, fs_1.mkdirSync)(this.uploadDir, { recursive: true });
        }
    }
    getUploadDir() {
        return this.uploadDir;
    }
    async findAll(query) {
        const assets = await this.prisma.asset.findMany({
            where: {
                clientId: query.clientId,
                fileType: query.fileType,
            },
            include: assetInclude,
            orderBy: { uploadedAt: 'desc' },
        });
        return assets.map((asset) => this.toResponse(asset));
    }
    async findByClientGrouped() {
        const assets = await this.prisma.asset.findMany({
            include: assetInclude,
            orderBy: [{ client: { companyName: 'asc' } }, { uploadedAt: 'desc' }],
        });
        const grouped = new Map();
        for (const asset of assets) {
            const key = asset.clientId;
            const entry = grouped.get(key) ?? {
                client: asset.client,
                assets: [],
            };
            entry.assets.push(this.toResponse(asset));
            grouped.set(key, entry);
        }
        return Array.from(grouped.values());
    }
    async findOne(id) {
        const asset = await this.prisma.asset.findUnique({
            where: { id },
            include: assetInclude,
        });
        if (!asset)
            throw new common_1.NotFoundException('Asset not found');
        return this.toResponse(asset);
    }
    async upload(userId, dto, file) {
        if (!file) {
            throw new common_1.UnsupportedMediaTypeException('No file provided');
        }
        if (!ALLOWED_MIME.has(file.mimetype)) {
            throw new common_1.UnsupportedMediaTypeException(`File type ${file.mimetype} is not allowed`);
        }
        const client = await this.prisma.client.findUnique({
            where: { id: dto.clientId },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        const fileUrl = `/uploads/${file.filename}`;
        const asset = await this.prisma.asset.create({
            data: {
                clientId: dto.clientId,
                fileName: file.originalname,
                fileType: dto.fileType,
                fileUrl,
                fileSize: file.size,
                uploadedById: userId ?? undefined,
            },
            include: assetInclude,
        });
        return this.toResponse(asset);
    }
    async remove(id) {
        const asset = await this.prisma.asset.findUnique({ where: { id } });
        if (!asset)
            throw new common_1.NotFoundException('Asset not found');
        await this.prisma.asset.delete({ where: { id } });
    }
    toResponse(asset) {
        return {
            id: asset.id,
            clientId: asset.clientId,
            client: asset.client,
            fileName: asset.fileName,
            fileType: asset.fileType.toLowerCase(),
            fileUrl: asset.fileUrl,
            fileSize: asset.fileSize,
            uploadedBy: asset.uploadedBy,
            uploadedAt: asset.uploadedAt.toISOString(),
        };
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map