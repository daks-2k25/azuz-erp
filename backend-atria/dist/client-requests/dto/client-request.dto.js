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
exports.ConvertClientRequestToTaskDto = exports.RejectClientRequestDto = exports.CreateClientRequestCommentDto = exports.QueryClientRequestsDto = exports.UpdateClientRequestDto = exports.CreateClientRequestDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const entity_id_1 = require("../../common/validation/entity-id");
function toUpperEnum({ value }) {
    return typeof value === 'string' ? value.trim().toUpperCase() : value;
}
function toContentTypeEnum({ value }) {
    if (typeof value !== 'string')
        return value;
    const normalized = value.trim().toUpperCase();
    const legacyMap = {
        POST: client_1.ClientRequestContentType.REDE_SOCIAL,
        POST_ESTATICO: client_1.ClientRequestContentType.REDE_SOCIAL,
        STATIC: client_1.ClientRequestContentType.REDE_SOCIAL,
        REELS: client_1.ClientRequestContentType.REDE_SOCIAL,
        CARROSSEL: client_1.ClientRequestContentType.REDE_SOCIAL,
        CAROUSEL: client_1.ClientRequestContentType.REDE_SOCIAL,
        STORIES: client_1.ClientRequestContentType.REDE_SOCIAL,
        STORY: client_1.ClientRequestContentType.REDE_SOCIAL,
    };
    return legacyMap[normalized] ?? normalized;
}
class CreateClientRequestDto {
    clientId;
    title;
    description;
    contentType;
    referenceLinks;
    attachments;
    status;
    relatedTaskId;
}
exports.CreateClientRequestDto = CreateClientRequestDto;
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], CreateClientRequestDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateClientRequestDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", String)
], CreateClientRequestDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toContentTypeEnum),
    (0, class_validator_1.IsEnum)(client_1.ClientRequestContentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClientRequestDto.prototype, "contentType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateClientRequestDto.prototype, "referenceLinks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateClientRequestDto.prototype, "attachments", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpperEnum),
    (0, class_validator_1.IsEnum)(client_1.ClientRequestStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClientRequestDto.prototype, "status", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], CreateClientRequestDto.prototype, "relatedTaskId", void 0);
class UpdateClientRequestDto {
    clientId;
    title;
    description;
    contentType;
    referenceLinks;
    attachments;
    status;
    relatedTaskId;
}
exports.UpdateClientRequestDto = UpdateClientRequestDto;
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], UpdateClientRequestDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateClientRequestDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", String)
], UpdateClientRequestDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toContentTypeEnum),
    (0, class_validator_1.IsEnum)(client_1.ClientRequestContentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateClientRequestDto.prototype, "contentType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateClientRequestDto.prototype, "referenceLinks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateClientRequestDto.prototype, "attachments", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpperEnum),
    (0, class_validator_1.IsEnum)(client_1.ClientRequestStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateClientRequestDto.prototype, "status", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], UpdateClientRequestDto.prototype, "relatedTaskId", void 0);
class QueryClientRequestsDto {
    clientId;
    status;
    contentType;
}
exports.QueryClientRequestsDto = QueryClientRequestsDto;
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], QueryClientRequestsDto.prototype, "clientId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpperEnum),
    (0, class_validator_1.IsEnum)(client_1.ClientRequestStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryClientRequestsDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toContentTypeEnum),
    (0, class_validator_1.IsEnum)(client_1.ClientRequestContentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryClientRequestsDto.prototype, "contentType", void 0);
class CreateClientRequestCommentDto {
    body;
    parentId;
}
exports.CreateClientRequestCommentDto = CreateClientRequestCommentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateClientRequestCommentDto.prototype, "body", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], CreateClientRequestCommentDto.prototype, "parentId", void 0);
class RejectClientRequestDto {
    rejectionReason;
}
exports.RejectClientRequestDto = RejectClientRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], RejectClientRequestDto.prototype, "rejectionReason", void 0);
class ConvertClientRequestToTaskDto {
    title;
    description;
    columnId;
    priority;
    dueDate;
    deliveryDate;
    publicationDate;
    assigneeId;
    assigneeIds;
    assignedGroupId;
}
exports.ConvertClientRequestToTaskDto = ConvertClientRequestToTaskDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ConvertClientRequestToTaskDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], ConvertClientRequestToTaskDto.prototype, "description", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], ConvertClientRequestToTaskDto.prototype, "columnId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpperEnum),
    (0, class_validator_1.IsEnum)(client_1.KanbanTaskPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ConvertClientRequestToTaskDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ConvertClientRequestToTaskDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ConvertClientRequestToTaskDto.prototype, "deliveryDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ConvertClientRequestToTaskDto.prototype, "publicationDate", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], ConvertClientRequestToTaskDto.prototype, "assigneeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_id_1.IsEntityId)({ each: true }),
    __metadata("design:type", Array)
], ConvertClientRequestToTaskDto.prototype, "assigneeIds", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], ConvertClientRequestToTaskDto.prototype, "assignedGroupId", void 0);
//# sourceMappingURL=client-request.dto.js.map