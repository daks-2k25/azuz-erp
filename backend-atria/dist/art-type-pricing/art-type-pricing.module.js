"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtTypePricingModule = void 0;
const common_1 = require("@nestjs/common");
const art_type_pricing_controller_1 = require("./art-type-pricing.controller");
const art_type_pricing_service_1 = require("./art-type-pricing.service");
let ArtTypePricingModule = class ArtTypePricingModule {
};
exports.ArtTypePricingModule = ArtTypePricingModule;
exports.ArtTypePricingModule = ArtTypePricingModule = __decorate([
    (0, common_1.Module)({
        controllers: [art_type_pricing_controller_1.ArtTypePricingController],
        providers: [art_type_pricing_service_1.ArtTypePricingService],
        exports: [art_type_pricing_service_1.ArtTypePricingService],
    })
], ArtTypePricingModule);
//# sourceMappingURL=art-type-pricing.module.js.map