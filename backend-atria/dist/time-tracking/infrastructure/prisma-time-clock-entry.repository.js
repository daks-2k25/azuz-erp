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
exports.PrismaTimeClockEntryRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const time_clock_entry_repository_1 = require("../application/ports/time-clock-entry.repository");
let PrismaTimeClockEntryRepository = class PrismaTimeClockEntryRepository extends time_clock_entry_repository_1.TimeClockEntryRepository {
    prisma;
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    listEffectiveEntries(employeeProfileId, workDate) {
        return findEffectiveEntries(this.prisma, employeeProfileId, workDate);
    }
    append(data, decideEntryType) {
        return this.prisma.$transaction(async (transaction) => {
            const sequenceNumber = await nextSequenceNumber(transaction, data.companyId);
            const entriesOfDay = await findEffectiveEntries(transaction, data.employeeProfileId, data.workDate);
            const entryType = decideEntryType(entriesOfDay);
            return transaction.timeClockEntry.create({
                data: {
                    companyId: data.companyId,
                    employeeProfileId: data.employeeProfileId,
                    sequenceNumber,
                    entryType,
                    workDate: data.workDate,
                    recordedAt: data.recordedAt,
                },
            });
        });
    }
};
exports.PrismaTimeClockEntryRepository = PrismaTimeClockEntryRepository;
exports.PrismaTimeClockEntryRepository = PrismaTimeClockEntryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaTimeClockEntryRepository);
async function nextSequenceNumber(transaction, companyId) {
    const counter = await transaction.timeClockCounter.upsert({
        where: { companyId },
        create: { companyId, lastSequenceNumber: 1 },
        update: { lastSequenceNumber: { increment: 1 } },
    });
    return counter.lastSequenceNumber;
}
function findEffectiveEntries(client, employeeProfileId, workDate) {
    return client.timeClockEntry.findMany({
        where: {
            employeeProfileId,
            workDate,
            replacedBy: { none: { status: client_1.TimeAdjustmentStatus.APPROVED } },
        },
        orderBy: [{ recordedAt: 'asc' }, { sequenceNumber: 'asc' }],
    });
}
//# sourceMappingURL=prisma-time-clock-entry.repository.js.map