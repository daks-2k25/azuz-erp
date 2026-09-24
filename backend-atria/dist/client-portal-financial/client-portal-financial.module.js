"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPortalFinancialModule = void 0;
const common_1 = require("@nestjs/common");
const client_portal_financial_controller_1 = require("./client-portal-financial.controller");
const client_portal_financial_service_1 = require("./client-portal-financial.service");
let ClientPortalFinancialModule = class ClientPortalFinancialModule {
};
exports.ClientPortalFinancialModule = ClientPortalFinancialModule;
exports.ClientPortalFinancialModule = ClientPortalFinancialModule = __decorate([
    (0, common_1.Module)({
        controllers: [client_portal_financial_controller_1.ClientPortalFinancialController],
        providers: [client_portal_financial_service_1.ClientPortalFinancialService],
        exports: [client_portal_financial_service_1.ClientPortalFinancialService],
    })
], ClientPortalFinancialModule);
//# sourceMappingURL=client-portal-financial.module.js.map