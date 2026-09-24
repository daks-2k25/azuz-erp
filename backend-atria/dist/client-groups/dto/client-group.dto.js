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
exports.UpdateClientGroupDto = exports.CreateClientGroupDto = void 0;
const class_validator_1 = require("class-validator");
class CreateClientGroupDto {
    name;
    description;
    color;
}
exports.CreateClientGroupDto = CreateClientGroupDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateClientGroupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateClientGroupDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsHexColor)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClientGroupDto.prototype, "color", void 0);
class UpdateClientGroupDto {
    name;
    description;
    color;
}
exports.UpdateClientGroupDto = UpdateClientGroupDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateClientGroupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateClientGroupDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsHexColor)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateClientGroupDto.prototype, "color", void 0);
//# sourceMappingURL=client-group.dto.js.map