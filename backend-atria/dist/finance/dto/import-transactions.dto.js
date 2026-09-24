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
exports.BulkImportTransactionsDto = exports.ImportTransactionItemDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class ImportTransactionItemDto {
    categoryName;
    description;
    amount;
    date;
    dueDate;
    status;
    type;
    companyName;
    managerName;
    serviceName;
    reference;
}
exports.ImportTransactionItemDto = ImportTransactionItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ImportTransactionItemDto.prototype, "categoryName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ImportTransactionItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ImportTransactionItemDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ImportTransactionItemDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ImportTransactionItemDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TransactionStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ImportTransactionItemDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TransactionType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ImportTransactionItemDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ImportTransactionItemDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ImportTransactionItemDto.prototype, "managerName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ImportTransactionItemDto.prototype, "serviceName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ImportTransactionItemDto.prototype, "reference", void 0);
class BulkImportTransactionsDto {
    transactions;
}
exports.BulkImportTransactionsDto = BulkImportTransactionsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ImportTransactionItemDto),
    __metadata("design:type", Array)
], BulkImportTransactionsDto.prototype, "transactions", void 0);
//# sourceMappingURL=import-transactions.dto.js.map