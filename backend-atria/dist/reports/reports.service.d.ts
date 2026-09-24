import { Prisma } from '@prisma/client';
import { MetaInsightsService } from '../meta-insights/meta-insights.service';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateReportDto, QueryReportsDto } from './dto/report.dto';
export declare class ReportsService {
    private readonly prisma;
    private readonly metaInsights;
    constructor(prisma: PrismaService, metaInsights: MetaInsightsService);
    generateReport(userId: string, clientId: string, dto: GenerateReportDto): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            email: string | null;
            avatarUrl: string | null;
            companyName: string;
            contactName: string | null;
            instagram: string | null;
        };
        month: number;
        year: number;
        title: string;
        data: Prisma.JsonValue;
        generatedBy: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        createdAt: string;
    }>;
    findAll(query: QueryReportsDto): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            email: string | null;
            avatarUrl: string | null;
            companyName: string;
            contactName: string | null;
            instagram: string | null;
        };
        month: number;
        year: number;
        title: string;
        data: Prisma.JsonValue;
        generatedBy: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        createdAt: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            email: string | null;
            avatarUrl: string | null;
            companyName: string;
            contactName: string | null;
            instagram: string | null;
        };
        month: number;
        year: number;
        title: string;
        data: Prisma.JsonValue;
        generatedBy: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        createdAt: string;
    }>;
    generatePortalToken(clientId: string): Promise<{
        clientId: string;
        companyName: string;
        token: string;
        portalUrl: string;
    }>;
    getPortalData(rawToken: string): Promise<{
        client: {
            id: string;
            email: string | null;
            avatarUrl: string | null;
            companyName: string;
            contactName: string | null;
            instagram: string | null;
        } | null;
        accountStatus: {
            activeContracts: number;
            pendingApprovals: number;
            scheduledPosts: number;
            publishedPosts: number;
            status: string;
        };
        pendingApprovalPosts: {
            id: string;
            title: string;
            platform: string;
            format: string;
            scheduledDate: string | null;
            status: string;
            copy: string | undefined;
        }[];
        scheduledPosts: {
            id: string;
            title: string;
            platform: string;
            format: string;
            scheduledDate: string | null;
            status: string;
            copy: string | undefined;
        }[];
        recentReports: {
            id: string;
            title: string;
            month: number;
            year: number;
            periodLabel: string;
            createdAt: string;
        }[];
        contracts: {
            id: string;
            title: string;
            status: string;
            recurringValue: number;
            paymentFrequency: string;
            startDate: string;
            endDate: string | null;
        }[];
    }>;
    getPortalReport(rawToken: string, reportId: string): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            email: string | null;
            avatarUrl: string | null;
            companyName: string;
            contactName: string | null;
            instagram: string | null;
        };
        month: number;
        year: number;
        title: string;
        data: Prisma.JsonValue;
        generatedBy: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        createdAt: string;
    }>;
    private resolvePortalToken;
    private hashToken;
    private getCompletedPosts;
    private getContentStats;
    private getActiveProjects;
    private getContentOverview;
    private toPortalPost;
    private toReportResponse;
}
