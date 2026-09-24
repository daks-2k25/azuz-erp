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
exports.QueryClient360Dto = exports.Client360Section = void 0;
const class_validator_1 = require("class-validator");
var Client360Section;
(function (Client360Section) {
    Client360Section["SUMMARY"] = "summary";
    Client360Section["PIPELINE"] = "pipeline";
    Client360Section["FINANCIAL"] = "financial";
    Client360Section["CALENDAR"] = "calendar";
    Client360Section["ASSETS"] = "assets";
    Client360Section["TASKS"] = "tasks";
})(Client360Section || (exports.Client360Section = Client360Section = {}));
class QueryClient360Dto {
    section;
}
exports.QueryClient360Dto = QueryClient360Dto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Client360Section),
    __metadata("design:type", String)
], QueryClient360Dto.prototype, "section", void 0);
//# sourceMappingURL=client-360.dto.js.map