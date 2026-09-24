"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaInsightsModule = void 0;
const common_1 = require("@nestjs/common");
const meta_insights_controller_1 = require("./meta-insights.controller");
const meta_insights_service_1 = require("./meta-insights.service");
let MetaInsightsModule = class MetaInsightsModule {
};
exports.MetaInsightsModule = MetaInsightsModule;
exports.MetaInsightsModule = MetaInsightsModule = __decorate([
    (0, common_1.Module)({
        controllers: [meta_insights_controller_1.MetaInsightsController],
        providers: [meta_insights_service_1.MetaInsightsService],
        exports: [meta_insights_service_1.MetaInsightsService],
    })
], MetaInsightsModule);
//# sourceMappingURL=meta-insights.module.js.map