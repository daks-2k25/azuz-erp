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
exports.CalendarController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const any_permissions_decorator_1 = require("../auth/decorators/any-permissions.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const rbac_1 = require("../auth/utils/rbac");
const calendar_service_1 = require("./calendar.service");
const event_dto_1 = require("./dto/event.dto");
let CalendarController = class CalendarController {
    calendarService;
    constructor(calendarService) {
        this.calendarService = calendarService;
    }
    getTeamMembers() {
        return this.calendarService.getTeamMembers();
    }
    getEvents(query) {
        return this.calendarService.getEvents(query);
    }
    createEvent(user, dto) {
        return this.calendarService.createEvent(user.userId, dto);
    }
    updateEvent(user, id, dto) {
        return this.calendarService.updateEvent(id, user.userId, user.role, dto);
    }
    deleteEvent(user, id) {
        return this.calendarService.deleteEvent(id, user.userId, user.role);
    }
};
exports.CalendarController = CalendarController;
__decorate([
    (0, common_1.Get)('members'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "getTeamMembers", null);
__decorate([
    (0, common_1.Get)('events'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_dto_1.QueryEventsDto]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Post)('events'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, event_dto_1.CreateEventDto]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Patch)('events/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, event_dto_1.UpdateEventDto]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.Delete)('events/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "deleteEvent", null);
exports.CalendarController = CalendarController = __decorate([
    (0, common_1.Controller)('calendar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, any_permissions_decorator_1.AnyPermissions)(...(0, rbac_1.getRequiredCalendarEditPermissions)()),
    __metadata("design:paramtypes", [calendar_service_1.CalendarService])
], CalendarController);
//# sourceMappingURL=calendar.controller.js.map