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
exports.AppUpdatesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const permissions_1 = require("../auth/constants/permissions");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const DEFAULT_COMPANY_ID = '00000000-0000-4000-8000-000000000001';
const SELECTABLE_ROLES = [
    client_1.RoleName.MASTER,
    client_1.RoleName.ADMIN,
    client_1.RoleName.MANAGER,
    client_1.RoleName.USER,
    client_1.RoleName.CONTENT_CREATOR,
    client_1.RoleName.DESIGNER_MASTER,
    client_1.RoleName.DESIGNER_JUNIOR,
    client_1.RoleName.CRM,
];
let AppUpdatesService = class AppUpdatesService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async getAccess(userId, role, companyId) {
        const roleName = (0, permissions_1.normalizeRoleName)(role);
        const canManage = roleName === client_1.RoleName.MASTER;
        const unreadCount = await this.notifications.getAppUpdateUnreadCount(userId);
        if (canManage) {
            const updateCount = await this.prisma.appUpdate.count({
                where: companyId ? { companyId } : {},
            });
            return {
                canView: true,
                canManage: true,
                unreadCount,
                updateCount,
            };
        }
        if (!roleName) {
            return {
                canView: false,
                canManage: false,
                unreadCount: 0,
                updateCount: 0,
            };
        }
        const updateCount = await this.prisma.appUpdate.count({
            where: this.viewerWhere(roleName, companyId),
        });
        return {
            canView: updateCount > 0,
            canManage: false,
            unreadCount,
            updateCount,
        };
    }
    async markAsRead(userId) {
        await this.notifications.markAppUpdateNotificationsAsRead(userId);
        return { success: true };
    }
    async markOneAsRead(userId, appUpdateId) {
        await this.findReadableUpdate(userId, appUpdateId);
        await this.notifications.markAppUpdateNotificationAsRead(userId, appUpdateId);
        return { success: true };
    }
    async findAll(userId, role, companyId) {
        const roleName = (0, permissions_1.normalizeRoleName)(role);
        if (!roleName) {
            throw new common_1.ForbiddenException('Invalid role');
        }
        const isMaster = roleName === client_1.RoleName.MASTER;
        const items = await this.prisma.appUpdate.findMany({
            where: isMaster
                ? companyId
                    ? { companyId }
                    : {}
                : this.viewerWhere(roleName, companyId),
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const unreadNotifications = await this.prisma.notification.findMany({
            where: {
                userId,
                type: client_1.NotificationType.APP_UPDATE,
                isRead: false,
                appUpdateId: { in: items.map((item) => item.id) },
            },
            select: { appUpdateId: true },
        });
        const unreadIds = new Set(unreadNotifications
            .map((notification) => notification.appUpdateId)
            .filter((id) => Boolean(id)));
        return items.map((item) => ({
            ...this.toResponse(item),
            isRead: !unreadIds.has(item.id),
        }));
    }
    async create(userId, companyId, dto) {
        const visibleRoles = this.normalizeVisibleRoles(dto.visibleRoles);
        const resolvedCompanyId = companyId ?? DEFAULT_COMPANY_ID;
        const item = await this.prisma.appUpdate.create({
            data: {
                title: dto.title.trim(),
                body: dto.body.trim(),
                visibleRoles,
                isPublished: dto.isPublished ?? true,
                createdById: userId,
                companyId: resolvedCompanyId,
            },
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        if (item.isPublished) {
            await this.notifyEligibleUsers(item);
        }
        return this.toResponse(item);
    }
    async update(id, companyId, dto) {
        const existing = await this.findOwnedUpdate(id, companyId);
        const wasPublished = existing.isPublished;
        const updated = await this.prisma.appUpdate.update({
            where: { id: existing.id },
            data: {
                ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
                ...(dto.body !== undefined ? { body: dto.body.trim() } : {}),
                ...(dto.visibleRoles !== undefined
                    ? { visibleRoles: this.normalizeVisibleRoles(dto.visibleRoles) }
                    : {}),
                ...(dto.isPublished !== undefined
                    ? { isPublished: dto.isPublished }
                    : {}),
            },
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        if (updated.isPublished && !wasPublished) {
            await this.notifyEligibleUsers(updated);
        }
        return this.toResponse(updated);
    }
    async remove(id, companyId) {
        const existing = await this.findOwnedUpdate(id, companyId);
        await this.prisma.appUpdate.delete({ where: { id: existing.id } });
        return { success: true };
    }
    viewerWhere(roleName, companyId) {
        return {
            isPublished: true,
            visibleRoles: { has: roleName },
            ...(companyId ? { companyId } : {}),
        };
    }
    async findOwnedUpdate(id, companyId) {
        const item = await this.prisma.appUpdate.findFirst({
            where: {
                id,
                ...(companyId ? { companyId } : {}),
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('App update not found');
        }
        return item;
    }
    async notifyEligibleUsers(update) {
        const users = await this.prisma.user.findMany({
            where: {
                companyId: update.companyId,
                isActive: true,
                id: { not: update.createdById },
                role: {
                    name: { in: update.visibleRoles },
                },
            },
            select: { id: true },
        });
        await this.notifications.notifyAppUpdate(users.map((user) => user.id), update.title, { companyId: update.companyId, appUpdateId: update.id });
    }
    async findReadableUpdate(userId, appUpdateId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                companyId: true,
                role: { select: { name: true } },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('App update not found');
        }
        const roleName = user.role.name;
        const isMaster = roleName === client_1.RoleName.MASTER;
        const item = await this.prisma.appUpdate.findFirst({
            where: {
                id: appUpdateId,
                companyId: user.companyId,
                ...(isMaster
                    ? {}
                    : this.viewerWhere(roleName, user.companyId)),
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('App update not found');
        }
        return item;
    }
    normalizeVisibleRoles(roles) {
        const normalized = roles
            .map((role) => (0, permissions_1.normalizeRoleName)(String(role)))
            .filter((role) => role !== null)
            .filter((role) => SELECTABLE_ROLES.includes(role));
        if (normalized.length === 0) {
            throw new common_1.ForbiddenException('At least one valid role must be selected');
        }
        return Array.from(new Set(normalized));
    }
    toResponse(item) {
        return {
            id: item.id,
            title: item.title,
            body: item.body,
            visibleRoles: item.visibleRoles.map((role) => role.toLowerCase()),
            isPublished: item.isPublished,
            createdById: item.createdById,
            createdBy: item.createdBy,
            companyId: item.companyId,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
};
exports.AppUpdatesService = AppUpdatesService;
exports.AppUpdatesService = AppUpdatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], AppUpdatesService);
//# sourceMappingURL=app-updates.service.js.map