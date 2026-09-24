"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOCK_TIME_PATTERN = exports.MINUTES_PER_DAY = exports.MINUTES_PER_HOUR = void 0;
exports.isValidClockTime = isValidClockTime;
exports.clockTimeToMinutes = clockTimeToMinutes;
exports.minutesToClockTime = minutesToClockTime;
exports.MINUTES_PER_HOUR = 60;
exports.MINUTES_PER_DAY = 24 * exports.MINUTES_PER_HOUR;
exports.CLOCK_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
function isValidClockTime(value) {
    return exports.CLOCK_TIME_PATTERN.test(value);
}
function clockTimeToMinutes(value) {
    if (!isValidClockTime(value)) {
        throw new Error(`Horário inválido: "${value}". Use o formato HH:mm.`);
    }
    const [hours, minutes] = value.split(':').map(Number);
    return hours * exports.MINUTES_PER_HOUR + minutes;
}
function minutesToClockTime(totalMinutes) {
    if (!Number.isInteger(totalMinutes) ||
        totalMinutes < 0 ||
        totalMinutes > exports.MINUTES_PER_DAY) {
        throw new Error(`Minutos fora do intervalo de um dia: ${totalMinutes}.`);
    }
    const hours = Math.floor(totalMinutes / exports.MINUTES_PER_HOUR);
    const minutes = totalMinutes % exports.MINUTES_PER_HOUR;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
//# sourceMappingURL=clock-time.js.map