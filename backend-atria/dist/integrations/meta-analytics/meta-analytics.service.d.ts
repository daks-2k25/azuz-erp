import { ConfigService } from '@nestjs/config';
import { CompanySettingsService } from '../../company-settings/company-settings.service';
import { MetaDatePreset } from './dto/query-meta-analytics.dto';
export interface MetaAnalyticsSummary {
    totalSpend: number;
    totalRevenue: number;
    netProfit: number;
    roas: number;
    cpc: number;
    cpm: number;
    ctr: number;
    clicks: number;
    impressions: number;
    messagingConversations: number;
    linkClicks: number;
    postEngagement: number;
    datePreset: MetaDatePreset | 'custom';
    periodStart: string | null;
    periodEnd: string | null;
    source: 'meta';
}
export interface MetaAdAccountClient {
    id: string;
    accountId: string;
    name: string;
    accountStatus: number;
    currency: string;
    amountSpent: number;
    isActive: boolean;
}
export interface MetaAdAccountsResponse {
    clients: MetaAdAccountClient[];
    source: 'meta';
}
export interface MetaClientPerformancePoint {
    date: string;
    spend: number;
    impressions: number;
    clicks: number;
    revenue: number;
    ctr: number;
    messagingConversations: number;
}
export type MetaCampaignStatus = 'active' | 'paused' | 'completed' | 'learning' | 'unknown';
export interface MetaCampaignInsight {
    id: string;
    name: string;
    status: MetaCampaignStatus;
    effectiveStatus: string;
    budget: number;
    budgetType: 'daily' | 'lifetime' | null;
    spend: number;
    reach: number;
    frequency: number;
    impressions: number;
    clicks: number;
    cpc: number;
    cpm: number;
    ctr: number;
    conversions: number;
    revenue: number;
    roas: number;
    messagingConversations: number;
    linkClicks: number;
    periodStart: string | null;
    periodEnd: string | null;
}
export interface MetaCampaignsResponse {
    campaigns: MetaCampaignInsight[];
    source: 'meta';
    empty: boolean;
}
export interface MetaClientInsightsResponse {
    client: MetaAdAccountClient;
    overview: MetaAnalyticsSummary;
    performance: MetaClientPerformancePoint[];
    campaigns: MetaCampaignInsight[];
    source: 'meta';
    empty: boolean;
}
export interface MetaAgencyAccountRow {
    client: MetaAdAccountClient;
    overview: MetaAnalyticsSummary;
    empty: boolean;
}
export interface MetaAgencyOverviewResponse {
    accounts: MetaAgencyAccountRow[];
    totals: MetaAnalyticsSummary;
    source: 'meta';
    empty: boolean;
}
export interface MetaPeriodFilter {
    datePreset?: MetaDatePreset;
    month?: number;
    year?: number;
}
export declare class MetaAnalyticsService {
    private readonly config;
    private readonly companySettings;
    private readonly logger;
    constructor(config: ConfigService, companySettings: CompanySettingsService);
    getAnalytics(period?: MetaPeriodFilter, clientId?: string, adAccountId?: string): Promise<MetaAnalyticsSummary>;
    getAdAccounts(search?: string): Promise<MetaAdAccountsResponse>;
    getClientInsights(clientId: string | undefined, period?: MetaPeriodFilter): Promise<MetaClientInsightsResponse>;
    getCampaigns(clientId: string | undefined, period?: MetaPeriodFilter): Promise<MetaCampaignsResponse>;
    getAgencyOverview(period?: MetaPeriodFilter, search?: string): Promise<MetaAgencyOverviewResponse>;
    private fetchAllAdAccounts;
    private fetchAccountSummary;
    private fetchAccountDailyPerformance;
    private fetchCampaignInsights;
    private fetchAllCampaignInsightRows;
    private fetchAllCampaignMeta;
    private normalizeCampaignRow;
    private normalizeCampaignMetaOnly;
    private resolveCampaignBudget;
    private mapCampaignStatus;
    private extractConversions;
    private fetchAdAccountDetail;
    private buildInsightsUrl;
    private resolveCustomTimeRange;
    private fetchJson;
    private resolveAccessToken;
    private resolveAccountId;
    private normalizeAccountId;
    private isAccountActive;
    private mapAdAccountRow;
    private buildFallbackClient;
    private filterClientsBySearch;
    private normalizeRow;
    private extractRevenue;
    private extractActionValue;
    private parseNumber;
    private parseCents;
    private isOverviewEmpty;
    private buildEmptySummary;
    private sumOverviews;
}
