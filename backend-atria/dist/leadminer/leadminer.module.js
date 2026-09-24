"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadMinerModule = void 0;
const common_1 = require("@nestjs/common");
const company_settings_module_1 = require("../company-settings/company-settings.module");
const leads_module_1 = require("../leads/leads.module");
const leadminer_controller_1 = require("./leadminer.controller");
const leadminer_service_1 = require("./leadminer.service");
let LeadMinerModule = class LeadMinerModule {
};
exports.LeadMinerModule = LeadMinerModule;
exports.LeadMinerModule = LeadMinerModule = __decorate([
    (0, common_1.Module)({
        imports: [company_settings_module_1.CompanySettingsModule, leads_module_1.LeadsModule],
        controllers: [leadminer_controller_1.LeadMinerController],
        providers: [leadminer_service_1.LeadminerService],
        exports: [leadminer_service_1.LeadminerService],
    })
], LeadMinerModule);
//# sourceMappingURL=leadminer.module.js.map