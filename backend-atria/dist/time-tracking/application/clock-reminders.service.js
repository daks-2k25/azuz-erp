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
var ClockRemindersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockRemindersService = void 0;
const common_1 = require("@nestjs/common");
const clock_reminder_1 = require("../domain/clock-reminder");
const work_date_1 = require("../domain/work-date");
const clock_1 = require("./ports/clock");
const clock_reminder_repository_1 = require("./ports/clock-reminder.repository");
const reminder_notifier_1 = require("./ports/reminder-notifier");
const time_clock_entry_repository_1 = require("./ports/time-clock-entry.repository");
let ClockRemindersService = ClockRemindersService_1 = class ClockRemindersService {
    reminders;
    entries;
    notifier;
    clock;
    logger = new common_1.Logger(ClockRemindersService_1.name);
    constructor(reminders, entries, notifier, clock) {
        this.reminders = reminders;
        this.entries = entries;
        this.notifier = notifier;
        this.clock = clock;
    }
    async dispatchDueReminders() {
        const localNow = (0, work_date_1.toLocalDateTime)(this.clock.now());
        const candidates = await this.reminders.listActiveCandidates();
        let sentCount = 0;
        for (const candidate of candidates) {
            try {
                const wasSent = await this.remindIfDue(candidate, localNow);
                if (wasSent)
                    sentCount += 1;
            }
            catch (error) {
                this.logger.error(`Falha ao processar lembrete do cadastro ${candidate.employeeProfileId}`, error instanceof Error ? error.stack : String(error));
            }
        }
        return sentCount;
    }
    async remindIfDue(candidate, localNow) {
        const scheduleDay = candidate.scheduleDays.find((day) => day.weekday === localNow.isoWeekday) ?? null;
        if (!scheduleDay)
            return false;
        const workDate = (0, work_date_1.calendarDateToWorkDate)(localNow.calendarDate);
        const entriesOfDay = await this.entries.listEffectiveEntries(candidate.employeeProfileId, workDate);
        const dueReminder = (0, clock_reminder_1.findDueReminder)({
            scheduleDay,
            toleranceMinutes: candidate.toleranceMinutes,
            entriesOfDay,
            minutesOfDay: localNow.minutesOfDay,
        });
        if (!dueReminder)
            return false;
        const isFirstTime = await this.reminders.tryRecordReminder(candidate.employeeProfileId, workDate, dueReminder.entryType);
        if (!isFirstTime)
            return false;
        await this.notifier.notify({
            userId: candidate.userId,
            companyId: candidate.companyId,
            ...(0, clock_reminder_1.reminderNotificationText)(dueReminder),
        });
        return true;
    }
};
exports.ClockRemindersService = ClockRemindersService;
exports.ClockRemindersService = ClockRemindersService = ClockRemindersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clock_reminder_repository_1.ClockReminderRepository,
        time_clock_entry_repository_1.TimeClockEntryRepository,
        reminder_notifier_1.ReminderNotifier,
        clock_1.Clock])
], ClockRemindersService);
//# sourceMappingURL=clock-reminders.service.js.map