"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDueReminder = findDueReminder;
exports.reminderNotificationText = reminderNotificationText;
const clock_time_1 = require("./clock-time");
const time_clock_entry_1 = require("./time-clock-entry");
function findDueReminder(check) {
    if (!check.scheduleDay)
        return null;
    const entryType = (0, time_clock_entry_1.nextEntryType)(check.entriesOfDay);
    if (!entryType)
        return null;
    const expectedMinutes = expectedMinutesFor(check.scheduleDay, entryType);
    const isOverdue = check.minutesOfDay >= expectedMinutes + check.toleranceMinutes;
    return isOverdue ? { entryType, expectedMinutes } : null;
}
function reminderNotificationText(reminder) {
    const label = time_clock_entry_1.ENTRY_TYPE_LABELS[reminder.entryType].toLowerCase();
    const expectedTime = (0, clock_time_1.minutesToClockTime)(reminder.expectedMinutes);
    return {
        title: 'Lembrete de ponto',
        message: `Você ainda não registrou a ${label} de hoje (prevista para ${expectedTime}). Registre na aba Ponto.`,
    };
}
function expectedMinutesFor(day, entryType) {
    const expectedByType = {
        CLOCK_IN: day.startMinutes,
        BREAK_START: day.breakStartMinutes,
        BREAK_END: day.breakEndMinutes,
        CLOCK_OUT: day.endMinutes,
    };
    return expectedByType[entryType];
}
//# sourceMappingURL=clock-reminder.js.map