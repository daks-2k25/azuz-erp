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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const crm_scope_service_1 = require("../leads/crm-scope.service");
const prisma_service_1 = require("../prisma/prisma.service");
let OrganizationsService = class OrganizationsService {
    prisma;
    crmScope;
    constructor(prisma, crmScope) {
        this.prisma = prisma;
        this.crmScope = crmScope;
    }
    async updateCrmStatus(id, hasCrmEnabled) {
        const organization = await this.ensureOrganizationExists(id);
        const updated = await this.prisma.client.update({
            where: { id: organization.id },
            data: { hasCrmEnabled },
        });
        return this.toOrganizationResponse(updated);
    }
    async getOrganization(id) {
        const organization = await this.ensureOrganizationExists(id);
        const assignments = await this.prisma.crmSdrAssignment.findMany({
            where: { organizationId: organization.id },
            orderBy: { createdAt: 'asc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return {
            ...this.toOrganizationResponse(organization),
            sdrAssignments: assignments.map((assignment) => ({
                id: assignment.id,
                userId: assignment.user.id,
                name: assignment.user.name,
                email: assignment.user.email,
                createdAt: assignment.createdAt.toISOString(),
            })),
        };
    }
    async replaceSdrAssignments(id, sdrUserIds) {
        const organization = await this.ensureOrganizationExists(id);
        await this.crmScope.replaceOrganizationSdrAssignments(organization.id, sdrUserIds);
        const assignments = await this.prisma.crmSdrAssignment.findMany({
            where: { organizationId: organization.id },
            orderBy: { createdAt: 'asc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return {
            ...this.toOrganizationResponse(organization),
            sdrAssignments: assignments.map((assignment) => ({
                id: assignment.id,
                userId: assignment.user.id,
                name: assignment.user.name,
                email: assignment.user.email,
                createdAt: assignment.createdAt.toISOString(),
            })),
        };
    }
    listAssignedOrganizations(user) {
        return this.crmScope.listAssignedOrganizations(user);
    }
    async ensureOrganizationExists(id) {
        const organization = await this.prisma.client.findUnique({
            where: { id },
            select: {
                id: true,
                companyName: true,
                isActive: true,
                hasCrmEnabled: true,
            },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organização não encontrada.');
        }
        return organization;
    }
    toOrganizationResponse(organization) {
        return {
            id: organization.id,
            companyName: organization.companyName,
            isActive: organization.isActive,
            hasCrmEnabled: organization.hasCrmEnabled,
        };
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        crm_scope_service_1.CrmScopeService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map