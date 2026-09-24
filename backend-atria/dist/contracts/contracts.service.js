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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const finance_service_1 = require("../finance/finance.service");
const integrations_service_1 = require("../integrations/integrations.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const contractInclude = {
    client: {
        select: {
            id: true,
            companyName: true,
            contactName: true,
            email: true,
            phone: true,
            street: true,
            number: true,
            city: true,
            state: true,
            zipCode: true,
            avatarUrl: true,
        },
    },
    createdBy: {
        select: { id: true, name: true, email: true, avatarUrl: true },
    },
    _count: { select: { transactions: true } },
};
let ContractsService = class ContractsService {
    prisma;
    financeService;
    notifications;
    integrations;
    constructor(prisma, financeService, notifications, integrations) {
        this.prisma = prisma;
        this.financeService = financeService;
        this.notifications = notifications;
        this.integrations = integrations;
    }
    async findAll(query) {
        const contracts = await this.prisma.contract.findMany({
            where: {
                clientId: query.clientId,
                status: query.status,
            },
            include: contractInclude,
            orderBy: { createdAt: 'desc' },
        });
        return contracts.map((contract) => this.toResponse(contract));
    }
    async findOne(id) {
        const contract = await this.ensureExists(id);
        return this.toResponse(contract);
    }
    async create(userId, dto) {
        await this.ensureClientExists(dto.clientId);
        const contract = await this.prisma.contract.create({
            data: {
                clientId: dto.clientId,
                title: dto.title,
                status: dto.status ?? client_1.ContractStatus.DRAFT,
                recurringValue: dto.recurringValue,
                paymentFrequency: dto.paymentFrequency,
                startDate: new Date(dto.startDate),
                endDate: dto.endDate ? new Date(dto.endDate) : null,
                termsContent: dto.termsContent,
                pdfUrl: dto.pdfUrl,
                createdById: userId,
            },
            include: contractInclude,
        });
        return this.toResponse(contract);
    }
    async update(id, dto) {
        const existing = await this.ensureExists(id);
        if (existing.status === client_1.ContractStatus.SIGNED && dto.status !== undefined) {
            throw new common_1.BadRequestException('Signed contracts cannot change status through update. Use the sign endpoint.');
        }
        if (dto.clientId)
            await this.ensureClientExists(dto.clientId);
        const contract = await this.prisma.contract.update({
            where: { id },
            data: {
                ...dto,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate !== undefined
                    ? dto.endDate
                        ? new Date(dto.endDate)
                        : null
                    : undefined,
            },
            include: contractInclude,
        });
        return this.toResponse(contract);
    }
    async remove(id) {
        const contract = await this.ensureExists(id);
        if (contract.status === client_1.ContractStatus.SIGNED) {
            throw new common_1.BadRequestException('Cannot delete a signed contract');
        }
        await this.prisma.contract.delete({ where: { id } });
    }
    async signContract(userId, id, source = 'internal') {
        const contract = await this.ensureExists(id);
        if (contract.status === client_1.ContractStatus.SIGNED) {
            throw new common_1.BadRequestException('Contract is already signed');
        }
        if (contract.status === client_1.ContractStatus.CANCELLED ||
            contract.status === client_1.ContractStatus.EXPIRED) {
            throw new common_1.BadRequestException('Cannot sign a cancelled or expired contract');
        }
        await this.prisma.contract.update({
            where: { id },
            data: { status: client_1.ContractStatus.SIGNED },
        });
        const withClient = await this.prisma.contract.findUnique({
            where: { id },
            include: { client: true },
        });
        if (!withClient)
            throw new common_1.NotFoundException('Contract not found');
        const receivables = await this.financeService.generateReceivablesFromContract(userId, withClient);
        const adminUsers = await this.prisma.user.findMany({
            where: { role: { name: 'ADMIN' } },
            select: { id: true },
        });
        await this.notifications.notifyContractSigned([withClient.createdById, ...adminUsers.map((u) => u.id)], withClient.title, withClient.client.companyName);
        await this.integrations.notifyContractSigned({
            contractTitle: withClient.title,
            clientName: withClient.client.companyName,
            contractId: withClient.id,
            source,
        });
        const updated = await this.ensureExists(id);
        return {
            contract: this.toResponse(updated),
            receivablesGenerated: receivables.length,
            receivables,
        };
    }
    async ensureExists(id) {
        const contract = await this.prisma.contract.findUnique({
            where: { id },
            include: contractInclude,
        });
        if (!contract)
            throw new common_1.NotFoundException('Contract not found');
        return contract;
    }
    async ensureClientExists(id) {
        const client = await this.prisma.client.findUnique({ where: { id } });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return client;
    }
    toResponse(contract) {
        return {
            id: contract.id,
            clientId: contract.clientId,
            client: contract.client,
            title: contract.title,
            status: contract.status.toLowerCase(),
            recurringValue: Number(contract.recurringValue),
            paymentFrequency: contract.paymentFrequency.toLowerCase(),
            startDate: contract.startDate.toISOString(),
            endDate: contract.endDate?.toISOString() ?? null,
            termsContent: contract.termsContent,
            pdfUrl: contract.pdfUrl,
            createdBy: contract.createdBy,
            receivablesCount: contract._count.transactions,
            createdAt: contract.createdAt.toISOString(),
            updatedAt: contract.updatedAt.toISOString(),
        };
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        finance_service_1.FinanceService,
        notifications_service_1.NotificationsService,
        integrations_service_1.IntegrationsService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map