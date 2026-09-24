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
exports.ClientPortalFinancialService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const path_1 = require("path");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_storage_service_1 = require("../supabase/supabase-storage.service");
const ALLOWED_MIME = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
let ClientPortalFinancialService = class ClientPortalFinancialService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async listForClient(clientId) {
        const items = await this.prisma.clientFinancialAttachment.findMany({
            where: { clientId },
            orderBy: { uploadedAt: 'desc' },
        });
        return items.map((item) => this.toResponse(item));
    }
    async uploadForClient(clientId, dto, file) {
        if (!file) {
            throw new common_1.BadRequestException('Arquivo obrigatório');
        }
        if (!file.buffer?.length) {
            throw new common_1.BadRequestException('Arquivo inválido');
        }
        if (!ALLOWED_MIME.has(file.mimetype)) {
            throw new common_1.UnsupportedMediaTypeException(`Tipo de arquivo não permitido: ${file.mimetype}`);
        }
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
            select: { id: true, companyId: true },
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
        }
        const bucket = this.storage.getFinancialAttachmentsBucket();
        const extension = (0, path_1.extname)(file.originalname) || '';
        const storagePath = `${client.companyId}/${clientId}/${(0, crypto_1.randomUUID)()}${extension}`;
        let fileUrl;
        let storageBucket = bucket;
        let storagePathValue = storagePath;
        if (this.storage.isConfigured) {
            fileUrl = await this.storage.uploadFinancialObject({
                bucket,
                path: storagePath,
                body: file.buffer,
                contentType: file.mimetype,
            });
        }
        else {
            const { writeFileSync, mkdirSync, existsSync } = await import('fs');
            const { join } = await import('path');
            const uploadDir = join(process.cwd(), 'uploads', 'financial', clientId);
            if (!existsSync(uploadDir)) {
                mkdirSync(uploadDir, { recursive: true });
            }
            const filename = `${(0, crypto_1.randomUUID)()}${extension}`;
            const absolutePath = join(uploadDir, filename);
            writeFileSync(absolutePath, file.buffer);
            fileUrl = `/uploads/financial/${clientId}/${filename}`;
            storageBucket = null;
            storagePathValue = null;
        }
        const created = await this.prisma.clientFinancialAttachment.create({
            data: {
                clientId: client.id,
                organizationId: client.companyId,
                fileUrl,
                storageBucket,
                storagePath: storagePathValue,
                fileType: dto.fileType,
                description: dto.description?.trim() || null,
            },
        });
        return this.toResponse(created);
    }
    toResponse(item) {
        return {
            id: item.id,
            clientId: item.clientId,
            organizationId: item.organizationId,
            fileUrl: item.fileUrl,
            fileType: item.fileType.toLowerCase(),
            description: item.description,
            uploadedAt: item.uploadedAt.toISOString(),
        };
    }
};
exports.ClientPortalFinancialService = ClientPortalFinancialService;
exports.ClientPortalFinancialService = ClientPortalFinancialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_storage_service_1.SupabaseStorageService])
], ClientPortalFinancialService);
//# sourceMappingURL=client-portal-financial.service.js.map