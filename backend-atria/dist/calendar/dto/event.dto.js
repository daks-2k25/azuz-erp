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
exports.QueryEventsDto = exports.UpdateEventDto = exports.CreateEventDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const entity_id_1 = require("../../common/validation/entity-id");
class CreateEventDto {
    title;
    description;
    startAt;
    endAt;
    category;
    color;
    isPending;
    assigneeId;
    assignedGroupId;
    clientId;
    referenceUrl;
    createKanbanTask;
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "startAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "endAt", void 0);
__decorate([
    (0, entity_id_1.ToUpperEnum)(),
    (0, class_validator_1.IsEnum)(client_1.EventCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateEventDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "isPending", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "assigneeId", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "assignedGroupId", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((_, value) => value !== undefined && value !== null && value !== ''),
    (0, class_validator_1.IsUrl)({ require_protocol: true }),
    (0, class_validator_1.MaxLength)(2048),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "referenceUrl", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "createKanbanTask", void 0);
class UpdateEventDto {
    title;
    description;
    startAt;
    endAt;
    category;
    color;
    status;
    isPending;
    assigneeId;
    assignedGroupId;
    clientId;
    referenceUrl;
}
exports.UpdateEventDto = UpdateEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "startAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "endAt", void 0);
__decorate([
    (0, entity_id_1.ToUpperEnum)(),
    (0, class_validator_1.IsEnum)(client_1.EventCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "color", void 0);
__decorate([
    (0, entity_id_1.ToUpperEnum)(),
    (0, class_validator_1.IsEnum)(client_1.KanbanTaskStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEventDto.prototype, "isPending", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", Object)
], UpdateEventDto.prototype, "assigneeId", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", Object)
], UpdateEventDto.prototype, "assignedGroupId", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", Object)
], UpdateEventDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((_, value) => value !== undefined && value !== null && value !== ''),
    (0, class_validator_1.IsUrl)({ require_protocol: true }),
    (0, class_validator_1.MaxLength)(2048),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateEventDto.prototype, "referenceUrl", void 0);
class QueryEventsDto {
    from;
    to;
    clientId;
    includeUnmapped;
}
exports.QueryEventsDto = QueryEventsDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryEventsDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryEventsDto.prototype, "to", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], QueryEventsDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === true || value === 'true' || value === '1'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QueryEventsDto.prototype, "includeUnmapped", void 0);
//# sourceMappingURL=event.dto.js.map