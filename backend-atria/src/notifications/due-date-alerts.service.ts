import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  KanbanTaskStatus,
  NotificationType,
  RoleName,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

const PROJECT_MANAGER_ROLES: RoleName[] = [
  RoleName.MASTER,
  RoleName.ADMIN,
  RoleName.DESIGNER_MASTER,
];

const SAO_PAULO_TZ = 'America/Sao_Paulo';

@Injectable()
export class DueDateAlertsService {
  private readonly logger = new Logger(DueDateAlertsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('0 8 * * *', { timeZone: SAO_PAULO_TZ })
  async handleDailyDueDateAlerts() {
    await this.dispatchDueDateWarnings();
  }

  async dispatchDueDateWarnings() {
    const now = new Date();
    const horizon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const since = this.startOfTodayInSaoPaulo();

    const tasks = await this.prisma.kanbanTask.findMany({
      where: {
        deletedAt: null,
        status: { not: KanbanTaskStatus.OK },
        deliveryDate: { lte: horizon },
      },
      select: {
        id: true,
        title: true,
        companyId: true,
        deliveryDate: true,
        assignedGroupId: true,
        assignees: { select: { userId: true } },
        assignedGroup: {
          select: {
            users: { select: { id: true } },
            members: { select: { userId: true } },
          },
        },
      },
    });

    if (tasks.length === 0) {
      this.logger.log('No approaching or overdue delivery dates found');
      return { created: 0, tasks: 0 };
    }

    const companyIds = [...new Set(tasks.map((task) => task.companyId))];
    const managers = await this.prisma.user.findMany({
      where: {
        companyId: { in: companyIds },
        isActive: true,
        role: { name: { in: PROJECT_MANAGER_ROLES } },
      },
      select: { id: true, companyId: true },
    });

    const managersByCompany = new Map<string, string[]>();
    for (const manager of managers) {
      const current = managersByCompany.get(manager.companyId) ?? [];
      current.push(manager.id);
      managersByCompany.set(manager.companyId, current);
    }

    const existing = await this.prisma.notification.findMany({
      where: {
        type: NotificationType.DUE_DATE_WARNING,
        taskId: { in: tasks.map((task) => task.id) },
        createdAt: { gte: since },
      },
      select: { userId: true, taskId: true },
    });

    const alreadySent = new Set(
      existing.map((item) => `${item.userId}:${item.taskId}`),
    );

    let created = 0;

    for (const task of tasks) {
      const recipientIds = new Set<string>();

      for (const assignee of task.assignees) {
        recipientIds.add(assignee.userId);
      }

      for (const member of task.assignedGroup?.members ?? []) {
        recipientIds.add(member.userId);
      }

      for (const user of task.assignedGroup?.users ?? []) {
        recipientIds.add(user.id);
      }

      for (const managerId of managersByCompany.get(task.companyId) ?? []) {
        recipientIds.add(managerId);
      }

      const pendingIds = [...recipientIds].filter(
        (userId) => !alreadySent.has(`${userId}:${task.id}`),
      );

      if (pendingIds.length === 0) continue;

      const overdue = Boolean(
        task.deliveryDate && task.deliveryDate.getTime() < now.getTime(),
      );

      await this.notifications.notifyDueDateWarning(
        pendingIds,
        task.title,
        overdue,
        { companyId: task.companyId, taskId: task.id },
      );

      created += pendingIds.length;
    }

    this.logger.log(
      `Due date alerts dispatched for ${tasks.length} task(s), ${created} notification(s)`,
    );

    return { created, tasks: tasks.length };
  }

  private startOfTodayInSaoPaulo() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: SAO_PAULO_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
    return new Date(`${parts}T00:00:00-03:00`);
  }
}
