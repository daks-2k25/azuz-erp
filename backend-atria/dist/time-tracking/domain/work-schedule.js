"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidWorkScheduleError = exports.DEFAULT_REMINDER_TOLERANCE_MINUTES = exports.MAX_REMINDER_TOLERANCE_MINUTES = exports.MIN_REMINDER_TOLERANCE_MINUTES = exports.WEEKDAY_LABELS = void 0;
exports.isIsoWeekday = isIsoWeekday;
exports.expectedWorkMinutes = expectedWorkMinutes;
exports.expectedWeeklyWorkMinutes = expectedWeeklyWorkMinutes;
exports.assertValidWorkScheduleDays = assertValidWorkScheduleDays;
exports.assertValidReminderTolerance = assertValidReminderTolerance;
const clock_time_1 = require("./clock-time");
exports.WEEKDAY_LABELS = {
    1: 'Segunda-feira',
    2: 'Terça-feira',
    3: 'Quarta-feira',
    4: 'Quinta-feira',
    5: 'Sexta-feira',
    6: 'Sábado',
    7: 'Domingo',
};
exports.MIN_REMINDER_TOLERANCE_MINUTES = 0;
exports.MAX_REMINDER_TOLERANCE_MINUTES = 120;
exports.DEFAULT_REMINDER_TOLERANCE_MINUTES = 15;
class InvalidWorkScheduleError extends Error {
    constructor(message) {
        super(message);
        this.name = InvalidWorkScheduleError.name;
    }
}
exports.InvalidWorkScheduleError = InvalidWorkScheduleError;
function isIsoWeekday(value) {
    return Number.isInteger(value) && value >= 1 && value <= 7;
}
function expectedWorkMinutes(day) {
    const breakMinutes = day.breakEndMinutes - day.breakStartMinutes;
    return day.endMinutes - day.startMinutes - breakMinutes;
}
function expectedWeeklyWorkMinutes(days) {
    return days.reduce((total, day) => total + expectedWorkMinutes(day), 0);
}
function assertValidWorkScheduleDays(days) {
    if (days.length === 0) {
        throw new InvalidWorkScheduleError('A jornada precisa ter pelo menos um dia de trabalho.');
    }
    const seenWeekdays = new Set();
    for (const day of days) {
        assertValidWeekday(day.weekday);
        if (seenWeekdays.has(day.weekday)) {
            throw new InvalidWorkScheduleError(`${exports.WEEKDAY_LABELS[day.weekday]} foi informado mais de uma vez.`);
        }
        seenWeekdays.add(day.weekday);
        assertChronologicalTimes(day);
    }
}
function assertValidReminderTolerance(minutes) {
    const isInRange = Number.isInteger(minutes) &&
        minutes >= exports.MIN_REMINDER_TOLERANCE_MINUTES &&
        minutes <= exports.MAX_REMINDER_TOLERANCE_MINUTES;
    if (!isInRange) {
        throw new InvalidWorkScheduleError(`A tolerância do lembrete deve ser entre ${exports.MIN_REMINDER_TOLERANCE_MINUTES} e ${exports.MAX_REMINDER_TOLERANCE_MINUTES} minutos.`);
    }
}
function assertValidWeekday(weekday) {
    if (!isIsoWeekday(weekday)) {
        throw new InvalidWorkScheduleError(`Dia da semana inválido: ${weekday}. Use 1 (segunda) a 7 (domingo).`);
    }
}
function assertChronologicalTimes(day) {
    const isChronological = day.startMinutes >= 0 &&
        day.startMinutes < day.breakStartMinutes &&
        day.breakStartMinutes < day.breakEndMinutes &&
        day.breakEndMinutes < day.endMinutes &&
        day.endMinutes <= clock_time_1.MINUTES_PER_DAY;
    if (!isChronological) {
        throw new InvalidWorkScheduleError(`${exports.WEEKDAY_LABELS[day.weekday]}: os horários devem seguir a ordem entrada < saída para intervalo < volta do intervalo < saída.`);
    }
}
//# sourceMappingURL=work-schedule.js.map