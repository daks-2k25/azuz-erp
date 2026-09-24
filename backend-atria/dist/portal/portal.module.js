"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const assets_module_1 = require("../assets/assets.module");
const client_portal_financial_module_1 = require("../client-portal-financial/client-portal-financial.module");
const client_requests_module_1 = require("../client-requests/client-requests.module");
const contracts_module_1 = require("../contracts/contracts.module");
const deliverables_module_1 = require("../deliverables/deliverables.module");
const finance_module_1 = require("../finance/finance.module");
const kanban_module_1 = require("../kanban/kanban.module");
const leads_module_1 = require("../leads/leads.module");
const notifications_module_1 = require("../notifications/notifications.module");
const sla_module_1 = require("../sla/sla.module");
const client_portal_controller_1 = require("./client-portal.controller");
const client_portal_requests_controller_1 = require("./client-portal-requests.controller");
const portal_auth_guard_1 = require("./guards/portal-auth.guard");
const portal_auth_service_1 = require("./portal-auth.service");
const portal_controller_1 = require("./portal.controller");
const portal_session_controller_1 = require("./portal-session.controller");
const portal_service_1 = require("./portal.service");
let PortalModule = class PortalModule {
};
exports.PortalModule = PortalModule;
exports.PortalModule = PortalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({}),
            contracts_module_1.ContractsModule,
            assets_module_1.AssetsModule,
            notifications_module_1.NotificationsModule,
            sla_module_1.SlaModule,
            finance_module_1.FinanceModule,
            kanban_module_1.KanbanModule,
            client_requests_module_1.ClientRequestsModule,
            client_portal_financial_module_1.ClientPortalFinancialModule,
            deliverables_module_1.DeliverablesModule,
            leads_module_1.LeadsModule,
        ],
        controllers: [
            portal_controller_1.PortalController,
            portal_session_controller_1.PortalSessionController,
            portal_session_controller_1.PortalAuthRoutesController,
            client_portal_controller_1.ClientPortalController,
            client_portal_requests_controller_1.ClientPortalRequestsController,
        ],
        providers: [portal_service_1.PortalService, portal_auth_service_1.PortalAuthService, portal_auth_guard_1.PortalAuthGuard],
        exports: [portal_service_1.PortalService, portal_auth_service_1.PortalAuthService],
    })
], PortalModule);
//# sourceMappingURL=portal.module.js.map