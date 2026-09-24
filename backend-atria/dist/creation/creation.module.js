"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreationModule = void 0;
const common_1 = require("@nestjs/common");
const ai_module_1 = require("../ai/ai.module");
const calendar_module_1 = require("../calendar/calendar.module");
const content_module_1 = require("../content/content.module");
const kanban_module_1 = require("../kanban/kanban.module");
const creation_controller_1 = require("./creation.controller");
const creation_service_1 = require("./creation.service");
let CreationModule = class CreationModule {
};
exports.CreationModule = CreationModule;
exports.CreationModule = CreationModule = __decorate([
    (0, common_1.Module)({
        imports: [ai_module_1.AiModule, content_module_1.ContentModule, kanban_module_1.KanbanModule, calendar_module_1.CalendarModule],
        controllers: [creation_controller_1.CreationController],
        providers: [creation_service_1.CreationService],
    })
], CreationModule);
//# sourceMappingURL=creation.module.js.map