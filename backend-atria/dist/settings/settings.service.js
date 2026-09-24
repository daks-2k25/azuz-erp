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
exports.SettingsService = exports.DEFAULT_BRANDING = exports.DEFAULT_APPEARANCE = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_storage_service_1 = require("../supabase/supabase-storage.service");
const company_constants_1 = require("../company/company.constants");
exports.DEFAULT_APPEARANCE = {
    primaryColor: '#004949',
    accentColor: '#E8C39E',
    backgroundColor: '#FFFFFF',
    textColor: '#0F172A',
    sidebarColor: '#004949',
};
exports.DEFAULT_BRANDING = {
    agencyName: 'ATRIA ERP',
    logoUrl: null,
    faviconUrl: null,
    primaryColor: '#004949',
    accentColor: '#E8C39E',
};
const LOCAL_BRANDING_DIR = (0, path_1.join)(process.cwd(), 'uploads', 'branding');
let SettingsService = class SettingsService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async getAppearance(userId) {
        const settings = await this.prisma.userSettings.upsert({
            where: { userId },
            create: { userId, ...exports.DEFAULT_APPEARANCE },
            update: {},
        });
        return this.toAppearanceResponse(settings);
    }
    async updateAppearance(userId, dto) {
        const settings = await this.prisma.userSettings.upsert({
            where: { userId },
            create: { userId, ...dto },
            update: { ...dto },
        });
        return this.toAppearanceResponse(settings);
    }
    async getBranding() {
        const companyId = company_constants_1.DEFAULT_COMPANY_ID;
        const settings = await this.prisma.agencySettings.upsert({
            where: { companyId },
            create: { companyId, ...exports.DEFAULT_BRANDING },
            update: {},
        });
        return this.toBrandingResponse(settings);
    }
    async updateBranding(dto) {
        const companyId = company_constants_1.DEFAULT_COMPANY_ID;
        const settings = await this.prisma.agencySettings.upsert({
            where: { companyId },
            create: {
                companyId,
                ...exports.DEFAULT_BRANDING,
                ...dto,
                logoUrl: dto.logoUrl ?? null,
                faviconUrl: dto.faviconUrl ?? null,
            },
            update: {
                ...dto,
                logoUrl: dto.logoUrl === null || dto.logoUrl === ''
                    ? null
                    : dto.logoUrl,
                faviconUrl: dto.faviconUrl === null || dto.faviconUrl === ''
                    ? null
                    : dto.faviconUrl,
            },
        });
        return this.toBrandingResponse(settings);
    }
    async getIntegrations() {
        const companyId = company_constants_1.DEFAULT_COMPANY_ID;
        const settings = await this.prisma.agencySettings.upsert({
            where: { companyId },
            create: { companyId, ...exports.DEFAULT_BRANDING },
            update: {},
        });
        return this.toIntegrationsResponse(settings);
    }
    async updateIntegrations(dto) {
        const companyId = company_constants_1.DEFAULT_COMPANY_ID;
        const settings = await this.prisma.agencySettings.upsert({
            where: { companyId },
            create: {
                companyId,
                ...exports.DEFAULT_BRANDING,
                ...dto,
                slackWebhookUrl: dto.slackWebhookUrl ?? null,
                discordWebhookUrl: dto.discordWebhookUrl ?? null,
            },
            update: {
                ...dto,
                slackWebhookUrl: dto.slackWebhookUrl === null || dto.slackWebhookUrl === ''
                    ? null
                    : dto.slackWebhookUrl,
                discordWebhookUrl: dto.discordWebhookUrl === null || dto.discordWebhookUrl === ''
                    ? null
                    : dto.discordWebhookUrl,
            },
        });
        return this.toIntegrationsResponse(settings);
    }
    async updateBrandingAsset(type, fileUrl) {
        const data = type === 'logo'
            ? { logoUrl: fileUrl }
            : { faviconUrl: fileUrl };
        const companyId = company_constants_1.DEFAULT_COMPANY_ID;
        const settings = await this.prisma.agencySettings.upsert({
            where: { companyId },
            create: { companyId, ...exports.DEFAULT_BRANDING, ...data },
            update: data,
        });
        return this.toBrandingResponse(settings);
    }
    async uploadBrandingAsset(type, file) {
        const companyId = company_constants_1.DEFAULT_COMPANY_ID;
        const extension = (0, path_1.extname)(file.originalname) || '.png';
        const objectPath = `${companyId}/${type}-${(0, crypto_1.randomUUID)()}${extension}`;
        const fileUrl = await this.persistBrandingFile(objectPath, file);
        return this.updateBrandingAsset(type, fileUrl);
    }
    async persistBrandingFile(objectPath, file) {
        if (this.storage.isConfigured) {
            return this.storage.uploadPublicObject({
                bucket: 'branding',
                path: objectPath,
                body: file.buffer,
                contentType: file.mimetype,
                upsert: true,
            });
        }
        if (!(0, fs_1.existsSync)(LOCAL_BRANDING_DIR)) {
            (0, fs_1.mkdirSync)(LOCAL_BRANDING_DIR, { recursive: true });
        }
        const filename = objectPath.replace(/\//g, '_');
        (0, fs_1.writeFileSync)((0, path_1.join)(LOCAL_BRANDING_DIR, filename), file.buffer);
        return `/uploads/branding/${filename}`;
    }
    toAppearanceResponse(settings) {
        return {
            primaryColor: settings.primaryColor,
            accentColor: settings.accentColor,
            backgroundColor: settings.backgroundColor,
            textColor: settings.textColor,
            sidebarColor: settings.sidebarColor,
            updatedAt: settings.updatedAt.toISOString(),
        };
    }
    toBrandingResponse(settings) {
        return {
            agencyName: settings.agencyName,
            logoUrl: settings.logoUrl,
            faviconUrl: settings.faviconUrl,
            primaryColor: settings.primaryColor,
            accentColor: settings.accentColor,
            updatedAt: settings.updatedAt.toISOString(),
        };
    }
    toIntegrationsResponse(settings) {
        return {
            slackWebhookUrl: settings.slackWebhookUrl,
            discordWebhookUrl: settings.discordWebhookUrl,
            notifyOnPostRejected: settings.notifyOnPostRejected,
            notifyOnContractSigned: settings.notifyOnContractSigned,
            updatedAt: settings.updatedAt.toISOString(),
        };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_storage_service_1.SupabaseStorageService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map