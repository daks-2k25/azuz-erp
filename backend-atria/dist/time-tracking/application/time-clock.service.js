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
exports.TimeClockService = void 0;
const common_1 = require("@nestjs/common");
const time_clock_entry_1 = require("../domain/time-clock-entry");
const work_date_1 = require("../domain/work-date");
const work_schedule_1 = require("../domain/work-schedule");
const clock_1 = require("./ports/clock");
const employee_profile_repository_1 = require("./ports/employee-profile.repository");
const time_clock_entry_repository_1 = require("./ports/time-clock-entry.repository");
const work_schedules_service_1 = require("./work-schedules.service");
let TimeClockService = class TimeClockService {
    employeeProfiles;
    entries;
    workSchedules;
    clock;
    constructor(employeeProfiles, entries, workSchedules, clock) {
        this.employeeProfiles = employeeProfiles;
        this.entries = entries;
        this.workSchedules = workSchedules;
        this.clock = clock;
    }
    async getToday(userId) {
        const profile = await this.requireActiveProfile(userId);
        return this.buildTodaySummary(profile, this.clock.now());
    }
    async register(userId) {
        const profile = await this.requireActiveProfile(userId);
        const now = this.clock.now();
        const { calendarDate } = (0, work_date_1.toLocalDateTime)(now);
        const entry = await this.appendEntry(profile, calendarDate, now);
        const today = await this.buildTodaySummary(profile, now);
        return { entry, today };
    }
    async appendEntry(profile, calendarDate, now) {
        try {
            return await this.entries.append({
                companyId: profile.companyId,
                employeeProfileId: profile.id,
                workDate: (0, work_date_1.calendarDateToWorkDate)(calendarDate),
                recordedAt: now,
            }, (entriesOfDay) => (0, time_clock_entry_1.decideNewEntryType)(entriesOfDay, now));
        }
        catch (error) {
            if (error instanceof time_clock_entry_1.InvalidTimeClockEntryError) {
                throw new common_1.ConflictException(error.message);
            }
            throw error;
        }
    }
    async buildTodaySummary(profile, now) {
        const { calendarDate, isoWeekday } = (0, work_date_1.toLocalDateTime)(now);
        const [entriesOfDay, workSchedule] = await Promise.all([
            this.entries.listEffectiveEntries(profile.id, (0, work_date_1.calendarDateToWorkDate)(calendarDate)),
            this.workSchedules.getById(profile.companyId, profile.workScheduleId),
        ]);
        const scheduleDay = workSchedule.days.find((day) => day.weekday === isoWeekday) ?? null;
        return {
            calendarDate,
            isoWeekday,
            scheduleDay,
            entries: entriesOfDay,
            nextEntryType: (0, time_clock_entry_1.nextEntryType)(entriesOfDay),
            workedMinutes: (0, time_clock_entry_1.workedMinutes)(entriesOfDay, now),
            expectedMinutes: scheduleDay ? (0, work_schedule_1.expectedWorkMinutes)(scheduleDay) : 0,
            serverTime: now,
        };
    }
    async requireActiveProfile(userId) {
        const profile = await this.employeeProfiles.findByUserId(userId);
        if (!profile) {
            throw new common_1.ForbiddenException('Você não está cadastrado como funcionário CLT.');
        }
        if (!profile.isActive) {
            throw new common_1.ForbiddenException('Seu cadastro de ponto está desativado.');
        }
        return profile;
    }
};
exports.TimeClockService = TimeClockService;
exports.TimeClockService = TimeClockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employee_profile_repository_1.EmployeeProfileRepository,
        time_clock_entry_repository_1.TimeClockEntryRepository,
        work_schedules_service_1.WorkSchedulesService,
        clock_1.Clock])
], TimeClockService);
//# sourceMappingURL=time-clock.service.js.map