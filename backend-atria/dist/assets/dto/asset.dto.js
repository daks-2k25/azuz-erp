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
exports.CreateAssetDto = exports.QueryAssetsDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const entity_id_1 = require("../../common/validation/entity-id");
class QueryAssetsDto {
    clientId;
    fileType;
}
exports.QueryAssetsDto = QueryAssetsDto;
__decorate([
    (0, entity_id_1.IsEntityId)({ optional: true }),
    __metadata("design:type", String)
], QueryAssetsDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, entity_id_1.ToUpperEnum)(),
    (0, class_validator_1.IsEnum)(client_1.AssetFileType),
    __metadata("design:type", String)
], QueryAssetsDto.prototype, "fileType", void 0);
class CreateAssetDto {
    clientId;
    fileType;
}
exports.CreateAssetDto = CreateAssetDto;
__decorate([
    (0, entity_id_1.IsEntityId)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "clientId", void 0);
__decorate([
    (0, entity_id_1.ToUpperEnum)(),
    (0, class_validator_1.IsEnum)(client_1.AssetFileType),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "fileType", void 0);
//# sourceMappingURL=asset.dto.js.map