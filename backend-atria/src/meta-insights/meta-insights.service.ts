import { Injectable, NotFoundException } from '@nestjs/common';

export type CampaignStatus = 'active' | 'paused' | 'completed' | 'learning';

export interface MetaCampaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  budgetType: 'daily' | 'lifetime';
  spend: number;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
  ctr: number;
  roas: number;
  startDate: string;
  endDate: string | null;
}

@Injectable()
export class MetaInsightsService {
  private campaigns: MetaCampaign[] = this.buildCampaigns();

  getOverview() {
    const active = this.campaigns.filter((c) => c.status === 'active');

    const reach = this.campaigns.reduce((sum, c) => sum + c.reach, 0);
    const impressions = this.campaigns.reduce(
      (sum, c) => sum + c.impressions,
      0,
    );
    const totalSpend = this.campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalConversions = this.campaigns.reduce(
      (sum, c) => sum + c.conversions,
      0,
    );
    const totalRevenue = totalConversions * 185;
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    const totalEngagements = this.campaigns.reduce(
      (sum, c) => sum + Math.round(c.impressions * (c.ctr / 100) * 1.8),
      0,
    );
    const engagementRate =
      impressions > 0 ? (totalEngagements / impressions) * 100 : 0;

    return {
      reach,
      impressions,
      totalSpend: Math.round(totalSpend * 100) / 100,
      roas: Math.round(roas * 100) / 100,
      engagementRate: Math.round(engagementRate * 100) / 100,
      activeCampaigns: active.length,
      totalConversions,
    };
  }

  getPerformanceChart() {
    const days = 14;
    const data: { date: string; spend: number; conversions: number }[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const dayFactor = 0.7 + Math.sin(i * 0.8) * 0.3;
      const spend = Math.round((320 + Math.random() * 180) * dayFactor * 100) / 100;
      const conversions = Math.round((8 + Math.random() * 12) * dayFactor);

      data.push({
        date: date.toISOString().split('T')[0],
        spend,
        conversions,
      });
    }

    return data;
  }

  getCampaigns() {
    return this.campaigns.map((c) => ({ ...c }));
  }

  updateCampaignStatus(id: string, status: CampaignStatus) {
    const index = this.campaigns.findIndex((c) => c.id === id);
    if (index === -1) throw new NotFoundException('Campaign not found');

    this.campaigns[index] = { ...this.campaigns[index], status };
    return { ...this.campaigns[index] };
  }

  getClientMonthlyMetrics(clientId: string, month: number, year: number) {
    const seed = this.hashClientPeriod(clientId, month, year);
    const rng = this.seededRandom(seed);

    const daysInMonth = new Date(year, month, 0).getDate();
    const performanceChart: {
      date: string;
      spend: number;
      reach: number;
      engagement: number;
    }[] = [];

    let totalSpend = 0;
    let totalReach = 0;
    let totalEngagement = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayFactor = 0.75 + rng() * 0.5;
      const spend = Math.round((80 + rng() * 120) * dayFactor * 100) / 100;
      const reach = Math.round((2500 + rng() * 4500) * dayFactor);
      const engagement = Math.round(reach * (0.03 + rng() * 0.04));

      totalSpend += spend;
      totalReach += reach;
      totalEngagement += engagement;

      performanceChart.push({ date, spend, reach, engagement });
    }

    const impressions = Math.round(totalReach * (1.8 + rng() * 0.6));
    const engagementRate =
      impressions > 0 ? (totalEngagement / impressions) * 100 : 0;
    const conversions = Math.round(totalEngagement * (0.02 + rng() * 0.03));
    const roas =
      totalSpend > 0
        ? Math.round(((conversions * 185) / totalSpend) * 100) / 100
        : 0;

    const activeCampaigns = 2 + Math.floor(rng() * 3);

    return {
      reach: totalReach,
      impressions,
      spend: Math.round(totalSpend * 100) / 100,
      engagement: totalEngagement,
      engagementRate: Math.round(engagementRate * 100) / 100,
      conversions,
      roas,
      activeCampaigns,
      performanceChart,
    };
  }

  getPostInsights(postId: string, clientId: string) {
    const seed = this.hashClientPeriod(clientId, postId.length, postId.charCodeAt(0) || 1);
    const rng = this.seededRandom(seed ^ postId.length);

    const reach = Math.round(800 + rng() * 4200);
    const impressions = Math.round(reach * (1.6 + rng() * 0.8));
    const engagement = Math.round(reach * (0.03 + rng() * 0.05));
    const engagementRate =
      impressions > 0
        ? Math.round((engagement / impressions) * 10000) / 100
        : 0;

    return {
      postId,
      clientId,
      reach,
      impressions,
      engagement,
      engagementRate,
      platform: 'instagram' as const,
      isEstimated: true,
    };
  }

  getClientInsights(clientId: string) {
    const now = new Date();
    return this.getClientMonthlyMetrics(
      clientId,
      now.getMonth() + 1,
      now.getFullYear(),
    );
  }

  private hashClientPeriod(clientId: string, month: number, year: number) {
    let hash = 0;
    const str = `${clientId}-${year}-${month}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  private seededRandom(seed: number) {
    let state = seed;
    return () => {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  }

  private buildCampaigns(): MetaCampaign[] {
    return [
      {
        id: 'camp-001',
        name: 'Conversão — Lançamento Verão 2026',
        status: 'active',
        budget: 150,
        budgetType: 'daily',
        spend: 2847.32,
        reach: 128400,
        impressions: 312500,
        clicks: 4680,
        conversions: 186,
        cpc: 0.61,
        ctr: 1.5,
        roas: 4.2,
        startDate: '2026-07-01',
        endDate: '2026-07-31',
      },
      {
        id: 'camp-002',
        name: 'Tráfego — Blog & Landing Pages',
        status: 'active',
        budget: 80,
        budgetType: 'daily',
        spend: 1523.18,
        reach: 89200,
        impressions: 198600,
        clicks: 3174,
        conversions: 94,
        cpc: 0.48,
        ctr: 1.6,
        roas: 3.1,
        startDate: '2026-07-05',
        endDate: null,
      },
      {
        id: 'camp-003',
        name: 'Remarketing — Carrinho Abandonado',
        status: 'active',
        budget: 60,
        budgetType: 'daily',
        spend: 987.45,
        reach: 34500,
        impressions: 78400,
        clicks: 1960,
        conversions: 72,
        cpc: 0.5,
        ctr: 2.5,
        roas: 5.8,
        startDate: '2026-07-10',
        endDate: null,
      },
      {
        id: 'camp-004',
        name: 'Awareness — Vídeo Institucional',
        status: 'learning',
        budget: 200,
        budgetType: 'daily',
        spend: 412.6,
        reach: 156000,
        impressions: 420000,
        clicks: 2100,
        conversions: 18,
        cpc: 0.2,
        ctr: 0.5,
        roas: 1.4,
        startDate: '2026-07-18',
        endDate: '2026-08-18',
      },
      {
        id: 'camp-005',
        name: 'Leads — Webinar Marketing Digital',
        status: 'paused',
        budget: 100,
        budgetType: 'daily',
        spend: 1890.0,
        reach: 67800,
        impressions: 145200,
        clicks: 2904,
        conversions: 156,
        cpc: 0.65,
        ctr: 2.0,
        roas: 3.6,
        startDate: '2026-06-15',
        endDate: '2026-07-15',
      },
      {
        id: 'camp-006',
        name: 'Conversão — Black Friday Antecipada',
        status: 'completed',
        budget: 5000,
        budgetType: 'lifetime',
        spend: 5000.0,
        reach: 245000,
        impressions: 580000,
        clicks: 11600,
        conversions: 412,
        cpc: 0.43,
        ctr: 2.0,
        roas: 6.1,
        startDate: '2026-06-01',
        endDate: '2026-06-30',
      },
    ];
  }
}
