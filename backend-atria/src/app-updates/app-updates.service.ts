import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleName, NotificationType } from '@prisma/client';
import { normalizeRoleName } from '../auth/constants/permissions';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppUpdateDto, UpdateAppUpdateDto } from './dto/app-update.dto';

const DEFAULT_COMPANY_ID = '00000000-0000-4000-8000-000000000001';

const SELECTABLE_ROLES: RoleName[] = [
  RoleName.MASTER,
  RoleName.ADMIN,
  RoleName.MANAGER,
  RoleName.USER,
  RoleName.CONTENT_CREATOR,
  RoleName.DESIGNER_MASTER,
  RoleName.DESIGNER_JUNIOR,
  RoleName.CRM,
];

@Injectable()
export class AppUpdatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async getAccess(
    userId: string,
    role: string,
    companyId: string | null,
  ) {
    const roleName = normalizeRoleName(role);
    const canManage = roleName === RoleName.MASTER;
    const unreadCount =
      await this.notifications.getAppUpdateUnreadCount(userId);

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

  async markAsRead(userId: string) {
    await this.notifications.markAppUpdateNotificationsAsRead(userId);
    return { success: true };
  }

  async markOneAsRead(userId: string, appUpdateId: string) {
    await this.findReadableUpdate(userId, appUpdateId);
    await this.notifications.markAppUpdateNotificationAsRead(
      userId,
      appUpdateId,
    );
    return { success: true };
  }

  async findAll(userId: string, role: string, companyId: string | null) {
    const roleName = normalizeRoleName(role);
    if (!roleName) {
      throw new ForbiddenException('Invalid role');
    }

    const isMaster = roleName === RoleName.MASTER;
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
        type: NotificationType.APP_UPDATE,
        isRead: false,
        appUpdateId: { in: items.map((item) => item.id) },
      },
      select: { appUpdateId: true },
    });
    const unreadIds = new Set(
      unreadNotifications
        .map((notification) => notification.appUpdateId)
        .filter((id): id is string => Boolean(id)),
    );

    return items.map((item) => ({
      ...this.toResponse(item),
      isRead: !unreadIds.has(item.id),
    }));
  }

  async create(
    userId: string,
    companyId: string | null,
    dto: CreateAppUpdateDto,
  ) {
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

  async update(
    id: string,
    companyId: string | null,
    dto: UpdateAppUpdateDto,
  ) {
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

  async remove(id: string, companyId: string | null) {
    const existing = await this.findOwnedUpdate(id, companyId);
    await this.prisma.appUpdate.delete({ where: { id: existing.id } });
    return { success: true };
  }

  private viewerWhere(roleName: RoleName, companyId: string | null) {
    return {
      isPublished: true,
      visibleRoles: { has: roleName },
      ...(companyId ? { companyId } : {}),
    };
  }

  private async findOwnedUpdate(id: string, companyId: string | null) {
    const item = await this.prisma.appUpdate.findFirst({
      where: {
        id,
        ...(companyId ? { companyId } : {}),
      },
    });

    if (!item) {
      throw new NotFoundException('App update not found');
    }

    return item;
  }

  private async notifyEligibleUsers(update: {
    id: string;
    title: string;
    companyId: string;
    visibleRoles: RoleName[];
    createdById: string;
  }) {
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

    await this.notifications.notifyAppUpdate(
      users.map((user) => user.id),
      update.title,
      { companyId: update.companyId, appUpdateId: update.id },
    );
  }

  private async findReadableUpdate(userId: string, appUpdateId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        companyId: true,
        role: { select: { name: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('App update not found');
    }

    const roleName = user.role.name;
    const isMaster = roleName === RoleName.MASTER;
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
      throw new NotFoundException('App update not found');
    }

    return item;
  }

  private normalizeVisibleRoles(roles: RoleName[]): RoleName[] {
    const normalized = roles
      .map((role) => normalizeRoleName(String(role)))
      .filter((role): role is RoleName => role !== null)
      .filter((role) => SELECTABLE_ROLES.includes(role));

    if (normalized.length === 0) {
      throw new ForbiddenException('At least one valid role must be selected');
    }

    return Array.from(new Set(normalized));
  }

  private toResponse(item: {
    id: string;
    title: string;
    body: string;
    visibleRoles: RoleName[];
    isPublished: boolean;
    createdById: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: { id: string; name: string; email: string };
  }) {
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
}
