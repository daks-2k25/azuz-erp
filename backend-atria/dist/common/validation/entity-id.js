"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEntityId = IsEntityId;
exports.ToUpperEnum = ToUpperEnum;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function IsEntityId(options) {
    const each = Boolean(options?.each);
    const optional = Boolean(options?.optional);
    const decorators = [
        (0, class_validator_1.IsString)({ each }),
        (0, class_validator_1.IsNotEmpty)({ each }),
    ];
    if (optional) {
        return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateIf)((_, value) => value !== null && value !== undefined), ...decorators);
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ToUpperEnum() {
    return (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.toUpperCase() : value);
}
//# sourceMappingURL=entity-id.js.map