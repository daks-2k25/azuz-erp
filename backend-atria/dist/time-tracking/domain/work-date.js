"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPANY_TIME_ZONE = void 0;
exports.toLocalDateTime = toLocalDateTime;
exports.calendarDateToWorkDate = calendarDateToWorkDate;
const clock_time_1 = require("./clock-time");
exports.COMPANY_TIME_ZONE = 'America/Sao_Paulo';
const WEEKDAY_BY_SHORT_NAME = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
};
const localPartsFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: exports.COMPANY_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
});
function toLocalDateTime(instant) {
    const parts = Object.fromEntries(localPartsFormatter
        .formatToParts(instant)
        .map((part) => [part.type, part.value]));
    return {
        calendarDate: `${parts.year}-${parts.month}-${parts.day}`,
        isoWeekday: WEEKDAY_BY_SHORT_NAME[parts.weekday],
        minutesOfDay: Number(parts.hour) * clock_time_1.MINUTES_PER_HOUR + Number(parts.minute),
    };
}
function calendarDateToWorkDate(calendarDate) {
    return new Date(`${calendarDate}T00:00:00.000Z`);
}
//# sourceMappingURL=work-date.js.map