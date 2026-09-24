"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const kanban_module_1 = require("../kanban/kanban.module");
const mail_module_1 = require("../mail/mail.module");
const notifications_module_1 = require("../notifications/notifications.module");
const client_request_notification_service_1 = require("./client-request-notification.service");
const client_requests_controller_1 = require("./client-requests.controller");
const client_requests_service_1 = require("./client-requests.service");
let ClientRequestsModule = class ClientRequestsModule {
};
exports.ClientRequestsModule = ClientRequestsModule;
exports.ClientRequestsModule = ClientRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [kanban_module_1.KanbanModule, mail_module_1.MailModule, notifications_module_1.NotificationsModule],
        controllers: [client_requests_controller_1.ClientRequestsController],
        providers: [client_requests_service_1.ClientRequestsService, client_request_notification_service_1.ClientRequestNotificationService],
        exports: [client_requests_service_1.ClientRequestsService],
    })
], ClientRequestsModule);
//# sourceMappingURL=client-requests.module.js.map