"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIN_SECONDS_BETWEEN_ENTRIES = exports.InvalidTimeClockEntryError = exports.ENTRY_TYPE_LABELS = exports.DAILY_ENTRY_SEQUENCE = void 0;
exports.nextEntryType = nextEntryType;
exports.decideNewEntryType = decideNewEntryType;
exports.workedMinutes = workedMinutes;
const client_1 = require("@prisma/client");
exports.DAILY_ENTRY_SEQUENCE = [
    client_1.TimeClockEntryType.CLOCK_IN,
    client_1.TimeClockEntryType.BREAK_START,
    client_1.TimeClockEntryType.BREAK_END,
    client_1.TimeClockEntryType.CLOCK_OUT,
];
exports.ENTRY_TYPE_LABELS = {
    CLOCK_IN: 'Entrada',
    BREAK_START: 'Saída para almoço',
    BREAK_END: 'Volta do almoço',
    CLOCK_OUT: 'Saída',
};
class InvalidTimeClockEntryError extends Error {
    constructor(message) {
        super(message);
        this.name = InvalidTimeClockEntryError.name;
    }
}
exports.InvalidTimeClockEntryError = InvalidTimeClockEntryError;
exports.MIN_SECONDS_BETWEEN_ENTRIES = 60;
function nextEntryType(entriesOfDay) {
    return exports.DAILY_ENTRY_SEQUENCE[entriesOfDay.length] ?? null;
}
function decideNewEntryType(entriesOfDay, now) {
    const entryType = nextEntryType(entriesOfDay);
    if (!entryType) {
        throw new InvalidTimeClockEntryError('Você já registrou todas as marcações de hoje.');
    }
    const lastEntry = entriesOfDay.at(-1);
    if (lastEntry &&
        secondsBetween(lastEntry.recordedAt, now) < exports.MIN_SECONDS_BETWEEN_ENTRIES) {
        throw new InvalidTimeClockEntryError('Sua última marcação foi registrada há instantes. Aguarde 1 minuto para registrar a próxima.');
    }
    return entryType;
}
function workedMinutes(entriesOfDay, now) {
    const timeOf = (type) => entriesOfDay.find((entry) => entry.entryType === type)?.recordedAt;
    const morning = minutesBetween(timeOf(client_1.TimeClockEntryType.CLOCK_IN), timeOf(client_1.TimeClockEntryType.BREAK_START) ?? now);
    const afternoon = minutesBetween(timeOf(client_1.TimeClockEntryType.BREAK_END), timeOf(client_1.TimeClockEntryType.CLOCK_OUT) ?? now);
    return morning + afternoon;
}
function minutesBetween(start, end) {
    if (!start)
        return 0;
    return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60_000));
}
function secondsBetween(start, end) {
    return (end.getTime() - start.getTime()) / 1000;
}
//# sourceMappingURL=time-clock-entry.js.map