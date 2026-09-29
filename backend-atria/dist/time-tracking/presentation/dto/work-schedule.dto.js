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
exports.UpdateWorkScheduleDto = exports.CreateWorkScheduleDto = exports.WorkScheduleDayDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const clock_time_1 = require("../../domain/clock-time");
const work_schedule_1 = require("../../domain/work-schedule");
const CLOCK_TIME_MESSAGE = 'Use o formato HH:mm (ex.: 08:00).';
class WorkScheduleDayDto {
    weekday;
    start;
    breakStart;
    breakEnd;
    end;
}
exports.WorkScheduleDayDto = WorkScheduleDayDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(7),
    __metadata("design:type", Number)
], WorkScheduleDayDto.prototype, "weekday", void 0);
__decorate([
    (0, class_validator_1.Matches)(clock_time_1.CLOCK_TIME_PATTERN, { message: `start: ${CLOCK_TIME_MESSAGE}` }),
    __metadata("design:type", String)
], WorkScheduleDayDto.prototype, "start", void 0);
__decorate([
    (0, class_validator_1.Matches)(clock_time_1.CLOCK_TIME_PATTERN, { message: `breakStart: ${CLOCK_TIME_MESSAGE}` }),
    __metadata("design:type", String)
], WorkScheduleDayDto.prototype, "breakStart", void 0);
__decorate([
    (0, class_validator_1.Matches)(clock_time_1.CLOCK_TIME_PATTERN, { message: `breakEnd: ${CLOCK_TIME_MESSAGE}` }),
    __metadata("design:type", String)
], WorkScheduleDayDto.prototype, "breakEnd", void 0);
__decorate([
    (0, class_validator_1.Matches)(clock_time_1.CLOCK_TIME_PATTERN, { message: `end: ${CLOCK_TIME_MESSAGE}` }),
    __metadata("design:type", String)
], WorkScheduleDayDto.prototype, "end", void 0);
class CreateWorkScheduleDto {
    name;
    reminderToleranceMinutes;
    days;
}
exports.CreateWorkScheduleDto = CreateWorkScheduleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateWorkScheduleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(work_schedule_1.MIN_REMINDER_TOLERANCE_MINUTES),
    (0, class_validator_1.Max)(work_schedule_1.MAX_REMINDER_TOLERANCE_MINUTES),
    __metadata("design:type", Number)
], CreateWorkScheduleDto.prototype, "reminderToleranceMinutes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(7),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkScheduleDayDto),
    __metadata("design:type", Array)
], CreateWorkScheduleDto.prototype, "days", void 0);
class UpdateWorkScheduleDto {
    name;
    reminderToleranceMinutes;
    days;
}
exports.UpdateWorkScheduleDto = UpdateWorkScheduleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateWorkScheduleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(work_schedule_1.MIN_REMINDER_TOLERANCE_MINUTES),
    (0, class_validator_1.Max)(work_schedule_1.MAX_REMINDER_TOLERANCE_MINUTES),
    __metadata("design:type", Number)
], UpdateWorkScheduleDto.prototype, "reminderToleranceMinutes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(7),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkScheduleDayDto),
    __metadata("design:type", Array)
], UpdateWorkScheduleDto.prototype, "days", void 0);
//# sourceMappingURL=work-schedule.dto.js.map