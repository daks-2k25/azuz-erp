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
exports.UpdateEmployeeProfileDto = exports.CreateEmployeeProfileDto = void 0;
const class_validator_1 = require("class-validator");
const entity_id_1 = require("../../../common/validation/entity-id");
const ISO_DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const ISO_DATE_MESSAGE = 'admissionDate: use o formato AAAA-MM-DD.';
class CreateEmployeeProfileDto {
    userId;
    admissionDate;
    workScheduleId;
}
exports.CreateEmployeeProfileDto = CreateEmployeeProfileDto;
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], CreateEmployeeProfileDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.Matches)(ISO_DATE_PATTERN, { message: ISO_DATE_MESSAGE }),
    __metadata("design:type", String)
], CreateEmployeeProfileDto.prototype, "admissionDate", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], CreateEmployeeProfileDto.prototype, "workScheduleId", void 0);
class UpdateEmployeeProfileDto {
    admissionDate;
    workScheduleId;
}
exports.UpdateEmployeeProfileDto = UpdateEmployeeProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(ISO_DATE_PATTERN, { message: ISO_DATE_MESSAGE }),
    __metadata("design:type", String)
], UpdateEmployeeProfileDto.prototype, "admissionDate", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], UpdateEmployeeProfileDto.prototype, "workScheduleId", void 0);
//# sourceMappingURL=employee-profile.dto.js.map