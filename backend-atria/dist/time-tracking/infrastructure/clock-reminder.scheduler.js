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
var ClockReminderScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockReminderScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const clock_reminders_service_1 = require("../application/clock-reminders.service");
const work_date_1 = require("../domain/work-date");
let ClockReminderScheduler = ClockReminderScheduler_1 = class ClockReminderScheduler {
    clockReminders;
    logger = new common_1.Logger(ClockReminderScheduler_1.name);
    isRunning = false;
    constructor(clockReminders) {
        this.clockReminders = clockReminders;
    }
    async handleCron() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        try {
            const sentCount = await this.clockReminders.dispatchDueReminders();
            if (sentCount > 0) {
                this.logger.log(`${sentCount} lembrete(s) de ponto enviado(s)`);
            }
        }
        catch (error) {
            this.logger.error('Falha ao enviar lembretes de ponto', error instanceof Error ? error.stack : String(error));
        }
        finally {
            this.isRunning = false;
        }
    }
};
exports.ClockReminderScheduler = ClockReminderScheduler;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *', {
        name: 'time-clock-reminders',
        timeZone: work_date_1.COMPANY_TIME_ZONE,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClockReminderScheduler.prototype, "handleCron", null);
exports.ClockReminderScheduler = ClockReminderScheduler = ClockReminderScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clock_reminders_service_1.ClockRemindersService])
], ClockReminderScheduler);
//# sourceMappingURL=clock-reminder.scheduler.js.map