"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalApprovalsModule = void 0;
const common_1 = require("@nestjs/common");
const deliverables_module_1 = require("../deliverables/deliverables.module");
const internal_approvals_controller_1 = require("./internal-approvals.controller");
const internal_approvals_service_1 = require("./internal-approvals.service");
let InternalApprovalsModule = class InternalApprovalsModule {
};
exports.InternalApprovalsModule = InternalApprovalsModule;
exports.InternalApprovalsModule = InternalApprovalsModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => deliverables_module_1.DeliverablesModule)],
        controllers: [internal_approvals_controller_1.InternalApprovalsController],
        providers: [internal_approvals_service_1.InternalApprovalsService],
    })
], InternalApprovalsModule);
//# sourceMappingURL=internal-approvals.module.js.map