"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTodayClockResponse = toTodayClockResponse;
exports.toRegisterEntryResponse = toRegisterEntryResponse;
const clock_time_1 = require("../domain/clock-time");
const time_clock_entry_1 = require("../domain/time-clock-entry");
const work_date_1 = require("../domain/work-date");
const work_schedule_1 = require("../domain/work-schedule");
const SEQUENCE_NUMBER_DIGITS = 9;
function toTodayClockResponse(today) {
    return {
        date: today.calendarDate,
        weekday: today.isoWeekday,
        weekdayLabel: work_schedule_1.WEEKDAY_LABELS[today.isoWeekday],
        isWorkday: today.scheduleDay !== null,
        expected: today.scheduleDay ? toExpectedTimes(today.scheduleDay) : null,
        entries: today.entries.map(toTimeClockEntryResponse),
        nextEntry: toNextEntry(today.nextEntryType),
        workedMinutes: today.workedMinutes,
        expectedMinutes: today.expectedMinutes,
        serverTime: today.serverTime.toISOString(),
    };
}
function toRegisterEntryResponse(result) {
    return {
        entry: toTimeClockEntryResponse(result.entry),
        today: toTodayClockResponse(result.today),
    };
}
function toTimeClockEntryResponse(entry) {
    return {
        id: entry.id,
        entryType: entry.entryType,
        label: time_clock_entry_1.ENTRY_TYPE_LABELS[entry.entryType],
        recordedAt: entry.recordedAt.toISOString(),
        time: (0, clock_time_1.minutesToClockTime)((0, work_date_1.toLocalDateTime)(entry.recordedAt).minutesOfDay),
        sequenceNumber: entry.sequenceNumber
            .toString()
            .padStart(SEQUENCE_NUMBER_DIGITS, '0'),
        origin: entry.origin,
    };
}
function toExpectedTimes(day) {
    return {
        CLOCK_IN: (0, clock_time_1.minutesToClockTime)(day.startMinutes),
        BREAK_START: (0, clock_time_1.minutesToClockTime)(day.breakStartMinutes),
        BREAK_END: (0, clock_time_1.minutesToClockTime)(day.breakEndMinutes),
        CLOCK_OUT: (0, clock_time_1.minutesToClockTime)(day.endMinutes),
    };
}
function toNextEntry(entryType) {
    return entryType ? { entryType, label: time_clock_entry_1.ENTRY_TYPE_LABELS[entryType] } : null;
}
//# sourceMappingURL=time-clock.mappers.js.map