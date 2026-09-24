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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const meta_insights_service_1 = require("../meta-insights/meta-insights.service");
const prisma_service_1 = require("../prisma/prisma.service");
const MONTH_NAMES = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];
const clientSelect = {
    id: true,
    companyName: true,
    contactName: true,
    email: true,
    avatarUrl: true,
    instagram: true,
};
const reportInclude = {
    client: { select: clientSelect },
    generatedBy: { select: { id: true, name: true, avatarUrl: true } },
};
let ReportsService = class ReportsService {
    prisma;
    metaInsights;
    constructor(prisma, metaInsights) {
        this.prisma = prisma;
        this.metaInsights = metaInsights;
    }
    async generateReport(userId, clientId, dto) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
            select: clientSelect,
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        const { month, year } = dto;
        const periodStart = new Date(year, month - 1, 1);
        const periodEnd = new Date(year, month, 0, 23, 59, 59, 999);
        const [completedPosts, activeContracts, contentOverview] = await Promise.all([
            this.getCompletedPosts(clientId, periodStart, periodEnd),
            this.getActiveProjects(clientId, periodStart, periodEnd),
            this.getContentStats(clientId, periodStart, periodEnd),
        ]);
        const meta = this.metaInsights.getClientMonthlyMetrics(clientId, month, year);
        const data = {
            client,
            period: { month, year, label: `${MONTH_NAMES[month - 1]} ${year}` },
            content: {
                completedPosts,
                ...contentOverview,
            },
            meta,
            projects: { activeContracts },
            summary: {
                totalPostsPublished: completedPosts.length,
                activeProjectsCount: activeContracts.length,
                metaReach: meta.reach,
                metaSpend: meta.spend,
                metaEngagement: meta.engagement,
            },
        };
        const title = `Relatório Executivo — ${client.companyName} — ${MONTH_NAMES[month - 1]}/${year}`;
        const report = await this.prisma.clientReport.upsert({
            where: {
                clientId_month_year: { clientId, month, year },
            },
            create: {
                clientId,
                month,
                year,
                title,
                data,
                generatedById: userId,
            },
            update: {
                title,
                data,
                generatedById: userId,
            },
            include: reportInclude,
        });
        return this.toReportResponse(report);
    }
    async findAll(query) {
        const reports = await this.prisma.clientReport.findMany({
            where: {
                clientId: query.clientId,
                month: query.month,
                year: query.year,
            },
            include: reportInclude,
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
        return reports.map((r) => this.toReportResponse(r));
    }
    async findOne(id) {
        const report = await this.prisma.clientReport.findUnique({
            where: { id },
            include: reportInclude,
        });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        return this.toReportResponse(report);
    }
    async generatePortalToken(clientId) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
            select: { id: true, companyName: true },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const tokenHash = this.hashToken(rawToken);
        await this.prisma.clientPortalToken.upsert({
            where: { clientId },
            create: { clientId, tokenHash, isActive: true },
            update: { tokenHash, isActive: true, lastAccessedAt: null },
        });
        return {
            clientId: client.id,
            companyName: client.companyName,
            token: rawToken,
            portalUrl: `/portal/${rawToken}`,
        };
    }
    async getPortalData(rawToken) {
        const portalToken = await this.resolvePortalToken(rawToken);
        await this.prisma.clientPortalToken.update({
            where: { id: portalToken.id },
            data: { lastAccessedAt: new Date() },
        });
        const clientId = portalToken.clientId;
        const [client, pendingPosts, scheduledPosts, reports, contracts, overview] = await Promise.all([
            this.prisma.client.findUnique({
                where: { id: clientId },
                select: clientSelect,
            }),
            this.prisma.contentPost.findMany({
                where: {
                    clientId,
                    status: client_1.ContentPostStatus.PENDING_APPROVAL,
                },
                orderBy: { scheduledDate: 'asc' },
                take: 20,
                select: {
                    id: true,
                    title: true,
                    platform: true,
                    format: true,
                    scheduledDate: true,
                    status: true,
                    copy: true,
                },
            }),
            this.prisma.contentPost.findMany({
                where: {
                    clientId,
                    status: client_1.ContentPostStatus.SCHEDULED,
                },
                orderBy: { scheduledDate: 'asc' },
                take: 10,
                select: {
                    id: true,
                    title: true,
                    platform: true,
                    format: true,
                    scheduledDate: true,
                    status: true,
                },
            }),
            this.prisma.clientReport.findMany({
                where: { clientId },
                orderBy: [{ year: 'desc' }, { month: 'desc' }],
                take: 12,
                select: {
                    id: true,
                    title: true,
                    month: true,
                    year: true,
                    createdAt: true,
                },
            }),
            this.prisma.contract.findMany({
                where: { clientId, status: client_1.ContractStatus.SIGNED },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    recurringValue: true,
                    paymentFrequency: true,
                    startDate: true,
                    endDate: true,
                },
            }),
            this.getContentOverview(clientId),
        ]);
        return {
            client,
            accountStatus: {
                activeContracts: contracts.length,
                pendingApprovals: overview.pendingApproval,
                scheduledPosts: overview.scheduled,
                publishedPosts: overview.published,
                status: contracts.length > 0 ? 'active' : 'onboarding',
            },
            pendingApprovalPosts: pendingPosts.map((p) => this.toPortalPost(p)),
            scheduledPosts: scheduledPosts.map((p) => this.toPortalPost(p)),
            recentReports: reports.map((r) => ({
                id: r.id,
                title: r.title,
                month: r.month,
                year: r.year,
                periodLabel: `${MONTH_NAMES[r.month - 1]} ${r.year}`,
                createdAt: r.createdAt.toISOString(),
            })),
            contracts: contracts.map((c) => ({
                id: c.id,
                title: c.title,
                status: c.status.toLowerCase(),
                recurringValue: Number(c.recurringValue),
                paymentFrequency: c.paymentFrequency.toLowerCase(),
                startDate: c.startDate.toISOString(),
                endDate: c.endDate?.toISOString() ?? null,
            })),
        };
    }
    async getPortalReport(rawToken, reportId) {
        const portalToken = await this.resolvePortalToken(rawToken);
        const report = await this.prisma.clientReport.findFirst({
            where: { id: reportId, clientId: portalToken.clientId },
            include: reportInclude,
        });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        return this.toReportResponse(report);
    }
    async resolvePortalToken(rawToken) {
        const tokenHash = this.hashToken(rawToken);
        const portalToken = await this.prisma.clientPortalToken.findFirst({
            where: { tokenHash, isActive: true },
        });
        if (!portalToken) {
            throw new common_1.UnauthorizedException('Invalid or expired portal token');
        }
        if (portalToken.expiresAt && portalToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Portal token has expired');
        }
        return portalToken;
    }
    hashToken(rawToken) {
        return (0, crypto_1.createHash)('sha256').update(rawToken).digest('hex');
    }
    async getCompletedPosts(clientId, periodStart, periodEnd) {
        const posts = await this.prisma.contentPost.findMany({
            where: {
                clientId,
                status: client_1.ContentPostStatus.PUBLISHED,
                OR: [
                    { scheduledDate: { gte: periodStart, lte: periodEnd } },
                    { updatedAt: { gte: periodStart, lte: periodEnd } },
                ],
            },
            orderBy: { scheduledDate: 'desc' },
            select: {
                id: true,
                title: true,
                platform: true,
                format: true,
                scheduledDate: true,
                status: true,
                copy: true,
            },
        });
        return posts.map((p) => this.toPortalPost(p));
    }
    async getContentStats(clientId, periodStart, periodEnd) {
        const posts = await this.prisma.contentPost.findMany({
            where: {
                clientId,
                status: client_1.ContentPostStatus.PUBLISHED,
                OR: [
                    { scheduledDate: { gte: periodStart, lte: periodEnd } },
                    { updatedAt: { gte: periodStart, lte: periodEnd } },
                ],
            },
            select: { platform: true, format: true },
        });
        const byPlatform = {};
        const byFormat = {};
        for (const post of posts) {
            const platform = post.platform.toLowerCase();
            const format = post.format.toLowerCase();
            byPlatform[platform] = (byPlatform[platform] ?? 0) + 1;
            byFormat[format] = (byFormat[format] ?? 0) + 1;
        }
        return { byPlatform, byFormat, publishedCount: posts.length };
    }
    async getActiveProjects(clientId, periodStart, periodEnd) {
        const contracts = await this.prisma.contract.findMany({
            where: {
                clientId,
                status: client_1.ContractStatus.SIGNED,
                startDate: { lte: periodEnd },
                OR: [{ endDate: null }, { endDate: { gte: periodStart } }],
            },
            select: {
                id: true,
                title: true,
                status: true,
                recurringValue: true,
                paymentFrequency: true,
                startDate: true,
                endDate: true,
            },
        });
        return contracts.map((c) => ({
            id: c.id,
            title: c.title,
            status: c.status.toLowerCase(),
            recurringValue: Number(c.recurringValue),
            paymentFrequency: c.paymentFrequency.toLowerCase(),
            startDate: c.startDate.toISOString(),
            endDate: c.endDate?.toISOString() ?? null,
        }));
    }
    async getContentOverview(clientId) {
        const [pendingApproval, scheduled, published] = await Promise.all([
            this.prisma.contentPost.count({
                where: { clientId, status: client_1.ContentPostStatus.PENDING_APPROVAL },
            }),
            this.prisma.contentPost.count({
                where: { clientId, status: client_1.ContentPostStatus.SCHEDULED },
            }),
            this.prisma.contentPost.count({
                where: { clientId, status: client_1.ContentPostStatus.PUBLISHED },
            }),
        ]);
        return { pendingApproval, scheduled, published };
    }
    toPortalPost(post) {
        return {
            id: post.id,
            title: post.title,
            platform: post.platform.toLowerCase(),
            format: post.format.toLowerCase(),
            scheduledDate: post.scheduledDate?.toISOString() ?? null,
            status: post.status.toLowerCase(),
            copy: post.copy,
        };
    }
    toReportResponse(report) {
        return {
            id: report.id,
            clientId: report.clientId,
            client: report.client,
            month: report.month,
            year: report.year,
            title: report.title,
            data: report.data,
            generatedBy: report.generatedBy,
            createdAt: report.createdAt.toISOString(),
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        meta_insights_service_1.MetaInsightsService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map