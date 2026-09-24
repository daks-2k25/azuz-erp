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
exports.CreateBriefPlanDto = exports.BriefPlanIdeaDto = exports.GenerateBriefPlanDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const entity_id_1 = require("../../common/validation/entity-id");
class GenerateBriefPlanDto {
    brief;
    clientId;
    platform;
    objective;
}
exports.GenerateBriefPlanDto = GenerateBriefPlanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", String)
], GenerateBriefPlanDto.prototype, "brief", void 0);
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], GenerateBriefPlanDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ContentPlatform),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateBriefPlanDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], GenerateBriefPlanDto.prototype, "objective", void 0);
class BriefPlanIdeaDto {
    title;
    copy;
    format;
    mediaConcept;
    suggestedDate;
}
exports.BriefPlanIdeaDto = BriefPlanIdeaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], BriefPlanIdeaDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], BriefPlanIdeaDto.prototype, "copy", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ContentPostFormat),
    __metadata("design:type", String)
], BriefPlanIdeaDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], BriefPlanIdeaDto.prototype, "mediaConcept", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BriefPlanIdeaDto.prototype, "suggestedDate", void 0);
class CreateBriefPlanDto {
    clientId;
    platform;
    ideas;
    createKanbanTasks;
}
exports.CreateBriefPlanDto = CreateBriefPlanDto;
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], CreateBriefPlanDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ContentPlatform),
    __metadata("design:type", String)
], CreateBriefPlanDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BriefPlanIdeaDto),
    __metadata("design:type", Array)
], CreateBriefPlanDto.prototype, "ideas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBriefPlanDto.prototype, "createKanbanTasks", void 0);
//# sourceMappingURL=brief-to-content.dto.js.map