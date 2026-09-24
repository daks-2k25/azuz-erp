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
var DueDateAlertsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DueDateAlertsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("./notifications.service");
const PROJECT_MANAGER_ROLES = [
    client_1.RoleName.MASTER,
    client_1.RoleName.ADMIN,
    client_1.RoleName.DESIGNER_MASTER,
];
const SAO_PAULO_TZ = 'America/Sao_Paulo';
let DueDateAlertsService = DueDateAlertsService_1 = class DueDateAlertsService {
    prisma;
    notifications;
    logger = new common_1.Logger(DueDateAlertsService_1.name);
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
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
                status: { not: client_1.KanbanTaskStatus.OK },
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
        const managersByCompany = new Map();
        for (const manager of managers) {
            const current = managersByCompany.get(manager.companyId) ?? [];
            current.push(manager.id);
            managersByCompany.set(manager.companyId, current);
        }
        const existing = await this.prisma.notification.findMany({
            where: {
                type: client_1.NotificationType.DUE_DATE_WARNING,
                taskId: { in: tasks.map((task) => task.id) },
                createdAt: { gte: since },
            },
            select: { userId: true, taskId: true },
        });
        const alreadySent = new Set(existing.map((item) => `${item.userId}:${item.taskId}`));
        let created = 0;
        for (const task of tasks) {
            const recipientIds = new Set();
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
            const pendingIds = [...recipientIds].filter((userId) => !alreadySent.has(`${userId}:${task.id}`));
            if (pendingIds.length === 0)
                continue;
            const overdue = Boolean(task.deliveryDate && task.deliveryDate.getTime() < now.getTime());
            await this.notifications.notifyDueDateWarning(pendingIds, task.title, overdue, { companyId: task.companyId, taskId: task.id });
            created += pendingIds.length;
        }
        this.logger.log(`Due date alerts dispatched for ${tasks.length} task(s), ${created} notification(s)`);
        return { created, tasks: tasks.length };
    }
    startOfTodayInSaoPaulo() {
        const parts = new Intl.DateTimeFormat('en-CA', {
            timeZone: SAO_PAULO_TZ,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date());
        return new Date(`${parts}T00:00:00-03:00`);
    }
};
exports.DueDateAlertsService = DueDateAlertsService;
__decorate([
    (0, schedule_1.Cron)('0 8 * * *', { timeZone: SAO_PAULO_TZ }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DueDateAlertsService.prototype, "handleDailyDueDateAlerts", null);
exports.DueDateAlertsService = DueDateAlertsService = DueDateAlertsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], DueDateAlertsService);
//# sourceMappingURL=due-date-alerts.service.js.map