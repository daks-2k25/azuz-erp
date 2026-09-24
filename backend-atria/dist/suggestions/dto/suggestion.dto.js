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
exports.UpdateSuggestionStatusDto = exports.CreateSuggestionDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateSuggestionDto {
    type;
    title;
    description;
}
exports.CreateSuggestionDto = CreateSuggestionDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SystemSuggestionType),
    __metadata("design:type", String)
], CreateSuggestionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateSuggestionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateSuggestionDto.prototype, "description", void 0);
class UpdateSuggestionStatusDto {
    status;
}
exports.UpdateSuggestionStatusDto = UpdateSuggestionStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SystemSuggestionStatus),
    __metadata("design:type", String)
], UpdateSuggestionStatusDto.prototype, "status", void 0);
//# sourceMappingURL=suggestion.dto.js.map