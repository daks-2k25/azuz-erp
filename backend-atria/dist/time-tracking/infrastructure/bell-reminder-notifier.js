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
exports.BellReminderNotifier = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../../notifications/notifications.service");
const reminder_notifier_1 = require("../application/ports/reminder-notifier");
let BellReminderNotifier = class BellReminderNotifier extends reminder_notifier_1.ReminderNotifier {
    notifications;
    constructor(notifications) {
        super();
        this.notifications = notifications;
    }
    async notify(notification) {
        await this.notifications.createMany([notification.userId], client_1.NotificationType.TIME_CLOCK_REMINDER, notification.title, notification.message, { companyId: notification.companyId });
    }
};
exports.BellReminderNotifier = BellReminderNotifier;
exports.BellReminderNotifier = BellReminderNotifier = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], BellReminderNotifier);
//# sourceMappingURL=bell-reminder-notifier.js.map