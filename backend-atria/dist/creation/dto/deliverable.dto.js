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
exports.UpdateItemStatusDto = exports.QueryClientPipelineDto = exports.CreateDeliverableDto = exports.CreationDeliverableStatus = exports.CreationDeliverableType = void 0;
const class_validator_1 = require("class-validator");
const entity_id_1 = require("../../common/validation/entity-id");
var CreationDeliverableType;
(function (CreationDeliverableType) {
    CreationDeliverableType["POST_INSTAGRAM"] = "post_instagram";
    CreationDeliverableType["POST_REELS"] = "post_reels";
    CreationDeliverableType["POST_CAROUSEL"] = "post_carousel";
    CreationDeliverableType["POST_STATIC"] = "post_static";
    CreationDeliverableType["POST_STORY"] = "post_story";
    CreationDeliverableType["MEETING"] = "reuniao";
    CreationDeliverableType["DELIVERY"] = "entrega";
})(CreationDeliverableType || (exports.CreationDeliverableType = CreationDeliverableType = {}));
var CreationDeliverableStatus;
(function (CreationDeliverableStatus) {
    CreationDeliverableStatus["DRAFT"] = "draft";
    CreationDeliverableStatus["PENDING"] = "pending";
    CreationDeliverableStatus["APPROVED"] = "approved";
})(CreationDeliverableStatus || (exports.CreationDeliverableStatus = CreationDeliverableStatus = {}));
class CreateDeliverableDto {
    clientId;
    title;
    type;
    scheduledAt;
    referenceUrl;
    status;
}
exports.CreateDeliverableDto = CreateDeliverableDto;
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], CreateDeliverableDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateDeliverableDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CreationDeliverableType),
    __metadata("design:type", String)
], CreateDeliverableDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDeliverableDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((_, value) => value !== undefined && value !== null && value !== ''),
    (0, class_validator_1.IsUrl)({ require_protocol: true }),
    (0, class_validator_1.MaxLength)(2048),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeliverableDto.prototype, "referenceUrl", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CreationDeliverableStatus),
    __metadata("design:type", String)
], CreateDeliverableDto.prototype, "status", void 0);
class QueryClientPipelineDto {
    clientId;
    from;
    to;
}
exports.QueryClientPipelineDto = QueryClientPipelineDto;
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], QueryClientPipelineDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryClientPipelineDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryClientPipelineDto.prototype, "to", void 0);
class UpdateItemStatusDto {
    status;
}
exports.UpdateItemStatusDto = UpdateItemStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(CreationDeliverableStatus),
    __metadata("design:type", String)
], UpdateItemStatusDto.prototype, "status", void 0);
//# sourceMappingURL=deliverable.dto.js.map