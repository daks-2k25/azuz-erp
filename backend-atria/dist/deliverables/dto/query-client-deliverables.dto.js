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
exports.QueryClientDeliverablesDto = exports.ClientPortalDeliverableStatus = void 0;
exports.mapClientPortalDeliverableStatus = mapClientPortalDeliverableStatus;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
var ClientPortalDeliverableStatus;
(function (ClientPortalDeliverableStatus) {
    ClientPortalDeliverableStatus["APPROVED"] = "APPROVED";
    ClientPortalDeliverableStatus["REJECTED"] = "REJECTED";
    ClientPortalDeliverableStatus["REQUIRES_ADJUSTMENT"] = "REQUIRES_ADJUSTMENT";
})(ClientPortalDeliverableStatus || (exports.ClientPortalDeliverableStatus = ClientPortalDeliverableStatus = {}));
function toUpperEnum({ value }) {
    return typeof value === 'string' ? value.trim().toUpperCase() : value;
}
function mapClientPortalDeliverableStatus(status) {
    switch (status) {
        case ClientPortalDeliverableStatus.APPROVED:
            return client_1.DeliverableApprovalStatus.APPROVED;
        case ClientPortalDeliverableStatus.REJECTED:
        case ClientPortalDeliverableStatus.REQUIRES_ADJUSTMENT:
            return client_1.DeliverableApprovalStatus.REQUIRES_ADJUSTMENT;
        default:
            return client_1.DeliverableApprovalStatus.REQUIRES_ADJUSTMENT;
    }
}
class QueryClientDeliverablesDto {
    month;
    year;
    status;
}
exports.QueryClientDeliverablesDto = QueryClientDeliverablesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], QueryClientDeliverablesDto.prototype, "month", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], QueryClientDeliverablesDto.prototype, "year", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpperEnum),
    (0, class_validator_1.IsEnum)(ClientPortalDeliverableStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryClientDeliverablesDto.prototype, "status", void 0);
//# sourceMappingURL=query-client-deliverables.dto.js.map