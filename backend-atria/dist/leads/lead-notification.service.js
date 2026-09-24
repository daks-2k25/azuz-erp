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
var LeadNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadNotificationService = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
let LeadNotificationService = LeadNotificationService_1 = class LeadNotificationService {
    prisma;
    notifications;
    logger = new common_1.Logger(LeadNotificationService_1.name);
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    notifyLeadCreated(input) {
        void this.dispatch(input).catch((error) => {
            const detail = error instanceof Error ? error.stack : String(error);
            this.logger.error(`Failed to notify representatives about lead "${input.leadName}": ${detail}`);
        });
    }
    async dispatch(input) {
        const representativeIds = await this.resolveRepresentativeUserIds(input.organizationId);
        const recipientIds = representativeIds.filter((userId) => userId !== input.actorId);
        if (recipientIds.length === 0) {
            return;
        }
        await this.notifications.notifyNewLeadInKanban(recipientIds, input.leadName, { companyId: input.companyId });
    }
    async resolveRepresentativeUserIds(organizationId) {
        const assignments = await this.prisma.crmSdrAssignment.findMany({
            where: {
                organizationId,
                user: { isActive: true },
            },
            select: { userId: true },
        });
        return [...new Set(assignments.map((assignment) => assignment.userId))];
    }
};
exports.LeadNotificationService = LeadNotificationService;
exports.LeadNotificationService = LeadNotificationService = LeadNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], LeadNotificationService);
//# sourceMappingURL=lead-notification.service.js.map