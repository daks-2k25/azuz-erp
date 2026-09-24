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
exports.ApproveClientReportFileDto = exports.QueryClientReportFilesDto = exports.UpdateClientReportFileDto = exports.CreateClientReportFileDto = void 0;
const class_validator_1 = require("class-validator");
const entity_id_1 = require("../../common/validation/entity-id");
class CreateClientReportFileDto {
    clientId;
    title;
    fileUrl;
    fileType;
    uploadedBy;
    status;
}
exports.CreateClientReportFileDto = CreateClientReportFileDto;
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], CreateClientReportFileDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateClientReportFileDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", String)
], CreateClientReportFileDto.prototype, "fileUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateClientReportFileDto.prototype, "fileType", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], CreateClientReportFileDto.prototype, "uploadedBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateClientReportFileDto.prototype, "status", void 0);
class UpdateClientReportFileDto {
    clientId;
    title;
    fileUrl;
    fileType;
    uploadedBy;
    status;
}
exports.UpdateClientReportFileDto = UpdateClientReportFileDto;
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], UpdateClientReportFileDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateClientReportFileDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", String)
], UpdateClientReportFileDto.prototype, "fileUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateClientReportFileDto.prototype, "fileType", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], UpdateClientReportFileDto.prototype, "uploadedBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateClientReportFileDto.prototype, "status", void 0);
class QueryClientReportFilesDto {
    clientId;
    status;
}
exports.QueryClientReportFilesDto = QueryClientReportFilesDto;
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], QueryClientReportFilesDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryClientReportFilesDto.prototype, "status", void 0);
class ApproveClientReportFileDto {
    approvedBy;
}
exports.ApproveClientReportFileDto = ApproveClientReportFileDto;
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], ApproveClientReportFileDto.prototype, "approvedBy", void 0);
//# sourceMappingURL=client-report-file.dto.js.map