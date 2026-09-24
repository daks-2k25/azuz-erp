"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBusinessDays = addBusinessDays;
function addBusinessDays(from, days) {
    const result = new Date(from.getTime());
    let remaining = days;
    while (remaining > 0) {
        result.setDate(result.getDate() + 1);
        const weekday = result.getDay();
        if (weekday !== 0 && weekday !== 6) {
            remaining -= 1;
        }
    }
    return result;
}
//# sourceMappingURL=business-days.js.map