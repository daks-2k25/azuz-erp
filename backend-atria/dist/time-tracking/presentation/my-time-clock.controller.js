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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyTimeClockController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const allow_authenticated_decorator_1 = require("../../auth/decorators/allow-authenticated.decorator");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const time_clock_service_1 = require("../application/time-clock.service");
const time_clock_mappers_1 = require("./time-clock.mappers");
const TIME_CLOCK_THROTTLE = {
    default: { limit: 10, ttl: 60_000 },
};
let MyTimeClockController = class MyTimeClockController {
    timeClock;
    constructor(timeClock) {
        this.timeClock = timeClock;
    }
    async getToday(user) {
        const today = await this.timeClock.getToday(user.userId);
        return (0, time_clock_mappers_1.toTodayClockResponse)(today);
    }
    async register(user) {
        const result = await this.timeClock.register(user.userId);
        return (0, time_clock_mappers_1.toRegisterEntryResponse)(result);
    }
};
exports.MyTimeClockController = MyTimeClockController;
__decorate([
    (0, common_1.Get)('today'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MyTimeClockController.prototype, "getToday", null);
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)(TIME_CLOCK_THROTTLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MyTimeClockController.prototype, "register", null);
exports.MyTimeClockController = MyTimeClockController = __decorate([
    (0, common_1.Controller)('time-tracking/me/clock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, allow_authenticated_decorator_1.AllowAuthenticated)(),
    __metadata("design:paramtypes", [time_clock_service_1.TimeClockService])
], MyTimeClockController);
//# sourceMappingURL=my-time-clock.controller.js.map