"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaAnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const company_settings_module_1 = require("../../company-settings/company-settings.module");
const meta_analytics_controller_1 = require("./meta-analytics.controller");
const meta_analytics_service_1 = require("./meta-analytics.service");
let MetaAnalyticsModule = class MetaAnalyticsModule {
};
exports.MetaAnalyticsModule = MetaAnalyticsModule;
exports.MetaAnalyticsModule = MetaAnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [company_settings_module_1.CompanySettingsModule],
        controllers: [meta_analytics_controller_1.MetaAnalyticsController],
        providers: [meta_analytics_service_1.MetaAnalyticsService],
        exports: [meta_analytics_service_1.MetaAnalyticsService],
    })
], MetaAnalyticsModule);
//# sourceMappingURL=meta-analytics.module.js.map