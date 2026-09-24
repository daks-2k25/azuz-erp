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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryMetaAnalyticsDto = exports.META_DATE_PRESETS = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
exports.META_DATE_PRESETS = [
    'today',
    'yesterday',
    'last_7d',
    'last_14d',
    'last_28d',
    'last_30d',
    'last_90d',
    'this_month',
    'last_month',
    'this_quarter',
    'this_year',
    'last_year',
    'maximum',
];
class QueryMetaAnalyticsDto {
    datePreset;
    clientId;
    adAccountId;
    month;
    year;
    search;
}
exports.QueryMetaAnalyticsDto = QueryMetaAnalyticsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.META_DATE_PRESETS),
    __metadata("design:type", String)
], QueryMetaAnalyticsDto.prototype, "datePreset", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryMetaAnalyticsDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryMetaAnalyticsDto.prototype, "adAccountId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], QueryMetaAnalyticsDto.prototype, "month", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2020),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], QueryMetaAnalyticsDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryMetaAnalyticsDto.prototype, "search", void 0);
//# sourceMappingURL=query-meta-analytics.dto.js.map