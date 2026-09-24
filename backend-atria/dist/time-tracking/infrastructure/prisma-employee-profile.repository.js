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
exports.PrismaEmployeeProfileRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const permissions_1 = require("../../auth/constants/permissions");
const prisma_service_1 = require("../../prisma/prisma.service");
const employee_profile_repository_1 = require("../application/ports/employee-profile.repository");
const EMPLOYEE_PROFILE_INCLUDE = {
    user: { select: { id: true, name: true, email: true, avatarUrl: true } },
    workSchedule: { select: { id: true, name: true } },
};
let PrismaEmployeeProfileRepository = class PrismaEmployeeProfileRepository extends employee_profile_repository_1.EmployeeProfileRepository {
    prisma;
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    listByCompany(companyId) {
        return this.prisma.employeeProfile.findMany({
            where: { companyId },
            include: EMPLOYEE_PROFILE_INCLUDE,
            orderBy: [{ isActive: 'desc' }, { user: { name: 'asc' } }],
        });
    }
    findById(companyId, employeeProfileId) {
        return this.prisma.employeeProfile.findFirst({
            where: { id: employeeProfileId, companyId },
            include: EMPLOYEE_PROFILE_INCLUDE,
        });
    }
    findByUserId(userId) {
        return this.prisma.employeeProfile.findUnique({
            where: { userId },
            include: EMPLOYEE_PROFILE_INCLUDE,
        });
    }
    async findEligibleUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                companyId: true,
                isActive: true,
                category: true,
                role: { select: { name: true } },
            },
        });
        if (!user)
            return null;
        return {
            id: user.id,
            companyId: user.companyId,
            isActive: user.isActive,
            isInternalMember: isInternalMember(user.category, user.role.name),
        };
    }
    create(data) {
        return this.prisma.employeeProfile.create({
            data: {
                companyId: data.companyId,
                userId: data.userId,
                admissionDate: data.admissionDate,
                workScheduleId: data.workScheduleId,
            },
            include: EMPLOYEE_PROFILE_INCLUDE,
        });
    }
    update(employeeProfileId, data) {
        return this.prisma.employeeProfile.update({
            where: { id: employeeProfileId },
            data,
            include: EMPLOYEE_PROFILE_INCLUDE,
        });
    }
};
exports.PrismaEmployeeProfileRepository = PrismaEmployeeProfileRepository;
exports.PrismaEmployeeProfileRepository = PrismaEmployeeProfileRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaEmployeeProfileRepository);
function isInternalMember(category, role) {
    return category === client_1.UserCategory.MEMBER && !(0, permissions_1.isClientFacingRole)(role);
}
//# sourceMappingURL=prisma-employee-profile.repository.js.map