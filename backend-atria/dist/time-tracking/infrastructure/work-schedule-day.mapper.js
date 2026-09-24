"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWorkScheduleDay = toWorkScheduleDay;
const work_schedule_1 = require("../domain/work-schedule");
function toWorkScheduleDay(record) {
    if (!(0, work_schedule_1.isIsoWeekday)(record.weekday)) {
        throw new Error(`Dia da semana inválido no banco: ${record.weekday}.`);
    }
    return {
        weekday: record.weekday,
        startMinutes: record.startMinutes,
        breakStartMinutes: record.breakStartMinutes,
        breakEndMinutes: record.breakEndMinutes,
        endMinutes: record.endMinutes,
    };
}
//# sourceMappingURL=work-schedule-day.mapper.js.map