"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeTrackingModule = void 0;
const common_1 = require("@nestjs/common");
const notifications_module_1 = require("../notifications/notifications.module");
const clock_reminders_service_1 = require("./application/clock-reminders.service");
const employee_profiles_service_1 = require("./application/employee-profiles.service");
const clock_1 = require("./application/ports/clock");
const clock_reminder_repository_1 = require("./application/ports/clock-reminder.repository");
const employee_profile_repository_1 = require("./application/ports/employee-profile.repository");
const reminder_notifier_1 = require("./application/ports/reminder-notifier");
const time_clock_entry_repository_1 = require("./application/ports/time-clock-entry.repository");
const work_schedule_repository_1 = require("./application/ports/work-schedule.repository");
const time_clock_service_1 = require("./application/time-clock.service");
const work_schedules_service_1 = require("./application/work-schedules.service");
const bell_reminder_notifier_1 = require("./infrastructure/bell-reminder-notifier");
const clock_reminder_scheduler_1 = require("./infrastructure/clock-reminder.scheduler");
const prisma_clock_reminder_repository_1 = require("./infrastructure/prisma-clock-reminder.repository");
const prisma_employee_profile_repository_1 = require("./infrastructure/prisma-employee-profile.repository");
const prisma_time_clock_entry_repository_1 = require("./infrastructure/prisma-time-clock-entry.repository");
const prisma_work_schedule_repository_1 = require("./infrastructure/prisma-work-schedule.repository");
const system_clock_1 = require("./infrastructure/system-clock");
const employee_profiles_controller_1 = require("./presentation/employee-profiles.controller");
const my_employee_profile_controller_1 = require("./presentation/my-employee-profile.controller");
const my_time_clock_controller_1 = require("./presentation/my-time-clock.controller");
const work_schedules_controller_1 = require("./presentation/work-schedules.controller");
let TimeTrackingModule = class TimeTrackingModule {
};
exports.TimeTrackingModule = TimeTrackingModule;
exports.TimeTrackingModule = TimeTrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        controllers: [
            work_schedules_controller_1.WorkSchedulesController,
            employee_profiles_controller_1.EmployeeProfilesController,
            my_employee_profile_controller_1.MyEmployeeProfileController,
            my_time_clock_controller_1.MyTimeClockController,
        ],
        providers: [
            { provide: clock_1.Clock, useClass: system_clock_1.SystemClock },
            { provide: work_schedule_repository_1.WorkScheduleRepository, useClass: prisma_work_schedule_repository_1.PrismaWorkScheduleRepository },
            {
                provide: employee_profile_repository_1.EmployeeProfileRepository,
                useClass: prisma_employee_profile_repository_1.PrismaEmployeeProfileRepository,
            },
            {
                provide: time_clock_entry_repository_1.TimeClockEntryRepository,
                useClass: prisma_time_clock_entry_repository_1.PrismaTimeClockEntryRepository,
            },
            {
                provide: clock_reminder_repository_1.ClockReminderRepository,
                useClass: prisma_clock_reminder_repository_1.PrismaClockReminderRepository,
            },
            { provide: reminder_notifier_1.ReminderNotifier, useClass: bell_reminder_notifier_1.BellReminderNotifier },
            work_schedules_service_1.WorkSchedulesService,
            employee_profiles_service_1.EmployeeProfilesService,
            time_clock_service_1.TimeClockService,
            clock_reminders_service_1.ClockRemindersService,
            clock_reminder_scheduler_1.ClockReminderScheduler,
        ],
        exports: [employee_profiles_service_1.EmployeeProfilesService, work_schedules_service_1.WorkSchedulesService, time_clock_service_1.TimeClockService],
    })
], TimeTrackingModule);
//# sourceMappingURL=time-tracking.module.js.map