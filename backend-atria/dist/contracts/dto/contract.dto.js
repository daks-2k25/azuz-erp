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
exports.QueryContractsDto = exports.UpdateContractDto = exports.CreateContractDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const entity_id_1 = require("../../common/validation/entity-id");
class CreateContractDto {
    clientId;
    title;
    status;
    recurringValue;
    paymentFrequency;
    startDate;
    endDate;
    termsContent;
    pdfUrl;
}
exports.CreateContractDto = CreateContractDto;
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateContractDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ContractStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "recurringValue", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.PaymentFrequency),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "paymentFrequency", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "termsContent", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "pdfUrl", void 0);
class UpdateContractDto {
    clientId;
    title;
    status;
    recurringValue;
    paymentFrequency;
    startDate;
    endDate;
    termsContent;
    pdfUrl;
}
exports.UpdateContractDto = UpdateContractDto;
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ContractStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateContractDto.prototype, "recurringValue", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.PaymentFrequency),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "paymentFrequency", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateContractDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "termsContent", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateContractDto.prototype, "pdfUrl", void 0);
class QueryContractsDto {
    clientId;
    status;
}
exports.QueryContractsDto = QueryContractsDto;
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], QueryContractsDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ContractStatus),
    __metadata("design:type", String)
], QueryContractsDto.prototype, "status", void 0);
//# sourceMappingURL=contract.dto.js.map