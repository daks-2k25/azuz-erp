import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ContentPostStatus,
  ContractStatus,
  Prisma,
} from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { MetaInsightsService } from '../meta-insights/meta-insights.service';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateReportDto, QueryReportsDto } from './dto/report.dto';

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
} as const;

const reportInclude = {
  client: { select: clientSelect },
  generatedBy: { select: { id: true, name: true, avatarUrl: true } },
} satisfies Prisma.ClientReportInclude;

type ReportWithRelations = Prisma.ClientReportGetPayload<{
  include: typeof reportInclude;
}>;

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metaInsights: MetaInsightsService,
  ) {}

  async generateReport(
    userId: string,
    clientId: string,
    dto: GenerateReportDto,
  ) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: clientSelect,
    });
    if (!client) throw new NotFoundException('Client not found');

    const { month, year } = dto;
    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0, 23, 59, 59, 999);

    const [completedPosts, activeContracts, contentOverview] =
      await Promise.all([
        this.getCompletedPosts(clientId, periodStart, periodEnd),
        this.getActiveProjects(clientId, periodStart, periodEnd),
        this.getContentStats(clientId, periodStart, periodEnd),
      ]);

    const meta = this.metaInsights.getClientMonthlyMetrics(
      clientId,
      month,
      year,
    );

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

  async findAll(query: QueryReportsDto) {
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

  async findOne(id: string) {
    const report = await this.prisma.clientReport.findUnique({
      where: { id },
      include: reportInclude,
    });
    if (!report) throw new NotFoundException('Report not found');
    return this.toReportResponse(report);
  }

  async generatePortalToken(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, companyName: true },
    });
    if (!client) throw new NotFoundException('Client not found');

    const rawToken = randomBytes(32).toString('hex');
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

  async getPortalData(rawToken: string) {
    const portalToken = await this.resolvePortalToken(rawToken);

    await this.prisma.clientPortalToken.update({
      where: { id: portalToken.id },
      data: { lastAccessedAt: new Date() },
    });

    const clientId = portalToken.clientId;

    const [client, pendingPosts, scheduledPosts, reports, contracts, overview] =
      await Promise.all([
        this.prisma.client.findUnique({
          where: { id: clientId },
          select: clientSelect,
        }),
        this.prisma.contentPost.findMany({
          where: {
            clientId,
            status: ContentPostStatus.PENDING_APPROVAL,
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
            status: ContentPostStatus.SCHEDULED,
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
          where: { clientId, status: ContractStatus.SIGNED },
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
        status:
          contracts.length > 0 ? 'active' : ('onboarding' as const),
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

  async getPortalReport(rawToken: string, reportId: string) {
    const portalToken = await this.resolvePortalToken(rawToken);
    const report = await this.prisma.clientReport.findFirst({
      where: { id: reportId, clientId: portalToken.clientId },
      include: reportInclude,
    });
    if (!report) throw new NotFoundException('Report not found');
    return this.toReportResponse(report);
  }

  private async resolvePortalToken(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);
    const portalToken = await this.prisma.clientPortalToken.findFirst({
      where: { tokenHash, isActive: true },
    });

    if (!portalToken) {
      throw new UnauthorizedException('Invalid or expired portal token');
    }

    if (portalToken.expiresAt && portalToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Portal token has expired');
    }

    return portalToken;
  }

  private hashToken(rawToken: string) {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private async getCompletedPosts(
    clientId: string,
    periodStart: Date,
    periodEnd: Date,
  ) {
    const posts = await this.prisma.contentPost.findMany({
      where: {
        clientId,
        status: ContentPostStatus.PUBLISHED,
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

  private async getContentStats(
    clientId: string,
    periodStart: Date,
    periodEnd: Date,
  ) {
    const posts = await this.prisma.contentPost.findMany({
      where: {
        clientId,
        status: ContentPostStatus.PUBLISHED,
        OR: [
          { scheduledDate: { gte: periodStart, lte: periodEnd } },
          { updatedAt: { gte: periodStart, lte: periodEnd } },
        ],
      },
      select: { platform: true, format: true },
    });

    const byPlatform: Record<string, number> = {};
    const byFormat: Record<string, number> = {};

    for (const post of posts) {
      const platform = post.platform.toLowerCase();
      const format = post.format.toLowerCase();
      byPlatform[platform] = (byPlatform[platform] ?? 0) + 1;
      byFormat[format] = (byFormat[format] ?? 0) + 1;
    }

    return { byPlatform, byFormat, publishedCount: posts.length };
  }

  private async getActiveProjects(
    clientId: string,
    periodStart: Date,
    periodEnd: Date,
  ) {
    const contracts = await this.prisma.contract.findMany({
      where: {
        clientId,
        status: ContractStatus.SIGNED,
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

  private async getContentOverview(clientId: string) {
    const [pendingApproval, scheduled, published] = await Promise.all([
      this.prisma.contentPost.count({
        where: { clientId, status: ContentPostStatus.PENDING_APPROVAL },
      }),
      this.prisma.contentPost.count({
        where: { clientId, status: ContentPostStatus.SCHEDULED },
      }),
      this.prisma.contentPost.count({
        where: { clientId, status: ContentPostStatus.PUBLISHED },
      }),
    ]);

    return { pendingApproval, scheduled, published };
  }

  private toPortalPost(post: {
    id: string;
    title: string;
    platform: string;
    format: string;
    scheduledDate: Date | null;
    status: string;
    copy?: string;
  }) {
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

  private toReportResponse(report: ReportWithRelations) {
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
}
