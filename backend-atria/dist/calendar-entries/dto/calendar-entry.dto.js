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
exports.QueryCalendarEntriesDto = exports.UpdateCalendarEntryDto = exports.CreateCalendarEntryDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const entity_id_1 = require("../../common/validation/entity-id");
class CreateCalendarEntryDto {
    month;
    year;
    clientId;
    artType;
    plannedDate;
    designerId;
    title;
    description;
    taskId;
    productionDeadline;
    storyQuantity;
}
exports.CreateCalendarEntryDto = CreateCalendarEntryDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], CreateCalendarEntryDto.prototype, "month", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    __metadata("design:type", Number)
], CreateCalendarEntryDto.prototype, "year", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], CreateCalendarEntryDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCalendarEntryDto.prototype, "artType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateCalendarEntryDto.prototype, "plannedDate", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], CreateCalendarEntryDto.prototype, "designerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateCalendarEntryDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateCalendarEntryDto.prototype, "description", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], CreateCalendarEntryDto.prototype, "taskId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateCalendarEntryDto.prototype, "productionDeadline", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCalendarEntryDto.prototype, "storyQuantity", void 0);
class UpdateCalendarEntryDto {
    month;
    year;
    clientId;
    artType;
    plannedDate;
    designerId;
    title;
    description;
    taskId;
    productionDeadline;
    storyQuantity;
}
exports.UpdateCalendarEntryDto = UpdateCalendarEntryDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateCalendarEntryDto.prototype, "month", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateCalendarEntryDto.prototype, "year", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], UpdateCalendarEntryDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCalendarEntryDto.prototype, "artType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateCalendarEntryDto.prototype, "plannedDate", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], UpdateCalendarEntryDto.prototype, "designerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateCalendarEntryDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], UpdateCalendarEntryDto.prototype, "description", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], UpdateCalendarEntryDto.prototype, "taskId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateCalendarEntryDto.prototype, "productionDeadline", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateCalendarEntryDto.prototype, "storyQuantity", void 0);
class QueryCalendarEntriesDto {
    year;
    month;
    clientId;
}
exports.QueryCalendarEntriesDto = QueryCalendarEntriesDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryCalendarEntriesDto.prototype, "year", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryCalendarEntriesDto.prototype, "month", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], QueryCalendarEntriesDto.prototype, "clientId", void 0);
//# sourceMappingURL=calendar-entry.dto.js.map