"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWorkScheduleDays = toWorkScheduleDays;
exports.parseCalendarDate = parseCalendarDate;
exports.toWorkScheduleResponse = toWorkScheduleResponse;
exports.toEmployeeProfileResponse = toEmployeeProfileResponse;
const clock_time_1 = require("../domain/clock-time");
const work_date_1 = require("../domain/work-date");
const work_schedule_1 = require("../domain/work-schedule");
function toWorkScheduleDays(dtos) {
    return dtos.map((dto) => ({
        weekday: dto.weekday,
        startMinutes: (0, clock_time_1.clockTimeToMinutes)(dto.start),
        breakStartMinutes: (0, clock_time_1.clockTimeToMinutes)(dto.breakStart),
        breakEndMinutes: (0, clock_time_1.clockTimeToMinutes)(dto.breakEnd),
        endMinutes: (0, clock_time_1.clockTimeToMinutes)(dto.end),
    }));
}
function parseCalendarDate(value) {
    return (0, work_date_1.calendarDateToWorkDate)(value);
}
function toWorkScheduleResponse(workSchedule) {
    return {
        id: workSchedule.id,
        name: workSchedule.name,
        reminderToleranceMinutes: workSchedule.reminderToleranceMinutes,
        isActive: workSchedule.isActive,
        weeklyWorkMinutes: (0, work_schedule_1.expectedWeeklyWorkMinutes)(workSchedule.days),
        days: workSchedule.days.map(toWorkScheduleDayResponse),
    };
}
function toWorkScheduleDayResponse(day) {
    return {
        weekday: day.weekday,
        weekdayLabel: work_schedule_1.WEEKDAY_LABELS[day.weekday],
        start: (0, clock_time_1.minutesToClockTime)(day.startMinutes),
        breakStart: (0, clock_time_1.minutesToClockTime)(day.breakStartMinutes),
        breakEnd: (0, clock_time_1.minutesToClockTime)(day.breakEndMinutes),
        end: (0, clock_time_1.minutesToClockTime)(day.endMinutes),
        workMinutes: (0, work_schedule_1.expectedWorkMinutes)(day),
    };
}
function toEmployeeProfileResponse(profile) {
    return {
        id: profile.id,
        userId: profile.userId,
        user: profile.user,
        employmentType: profile.employmentType,
        admissionDate: formatCalendarDate(profile.admissionDate),
        workSchedule: profile.workSchedule,
        isActive: profile.isActive,
    };
}
function formatCalendarDate(date) {
    return date.toISOString().slice(0, 10);
}
//# sourceMappingURL=time-tracking.mappers.js.map