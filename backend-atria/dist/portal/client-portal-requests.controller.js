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
exports.ClientPortalRequestsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_1 = require("../auth/constants/roles");
const client_requests_service_1 = require("../client-requests/client-requests.service");
const client_request_dto_1 = require("../client-requests/dto/client-request.dto");
let ClientPortalRequestsController = class ClientPortalRequestsController {
    clientRequestsService;
    constructor(clientRequestsService) {
        this.clientRequestsService = clientRequestsService;
    }
    reject(id, dto) {
        return this.clientRequestsService.reject(id, dto);
    }
    convertToTask(user, id, dto) {
        return this.clientRequestsService.convertToTask(id, user.userId, dto);
    }
};
exports.ClientPortalRequestsController = ClientPortalRequestsController;
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.MASTER, client_1.RoleName.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, client_request_dto_1.RejectClientRequestDto]),
    __metadata("design:returntype", void 0)
], ClientPortalRequestsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/convert-to-task'),
    (0, roles_decorator_1.Roles)(...roles_1.KANBAN_TASK_CREATE_ROLES),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, client_request_dto_1.ConvertClientRequestToTaskDto]),
    __metadata("design:returntype", void 0)
], ClientPortalRequestsController.prototype, "convertToTask", null);
exports.ClientPortalRequestsController = ClientPortalRequestsController = __decorate([
    (0, common_1.Controller)('client-portal/requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [client_requests_service_1.ClientRequestsService])
], ClientPortalRequestsController);
//# sourceMappingURL=client-portal-requests.controller.js.map