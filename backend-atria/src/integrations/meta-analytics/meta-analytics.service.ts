import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
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

export type MetaCampaignStatus =
  | 'active'
  | 'paused'
  | 'completed'
  | 'learning'
  | 'unknown';

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

interface MetaInsightsRow {
  campaign_id?: string;
  campaign_name?: string;
  spend?: string;
  reach?: string;
  frequency?: string;
  impressions?: string;
  clicks?: string;
  cpc?: string;
  cpm?: string;
  ctr?: string;
  date_start?: string;
  date_stop?: string;
  actions?: Array<{ action_type: string; value: string }>;
  action_values?: Array<{ action_type: string; value: string }>;
}

interface MetaInsightsResponse {
  data?: MetaInsightsRow[];
  paging?: { next?: string };
  error?: { message: string; type: string; code: number };
}

interface MetaCampaignRow {
  id: string;
  name: string;
  status?: string;
  effective_status?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
}

interface MetaCampaignsListResponse {
  data?: MetaCampaignRow[];
  paging?: { next?: string };
  error?: { message: string; type?: string; code?: number };
}

interface MetaAdAccountRow {
  id: string;
  name: string;
  account_id: string;
  account_status: number;
  currency: string;
  amount_spent?: string;
}

interface MetaAdAccountsListResponse {
  data?: MetaAdAccountRow[];
  paging?: { next?: string };
  error?: { message: string; type?: string; code?: number };
}

interface MetaAdAccountDetailResponse {
  id?: string;
  name?: string;
  account_id?: string;
  account_status?: number;
  currency?: string;
  amount_spent?: string;
  error?: { message: string; type?: string; code?: number };
}

export interface MetaPeriodFilter {
  datePreset?: MetaDatePreset;
  month?: number;
  year?: number;
}

const GRAPH_API_VERSION = 'v19.0';
const INSIGHT_FIELDS =
  'spend,reach,frequency,impressions,clicks,cpc,cpm,ctr,actions,action_values';
const DAILY_INSIGHT_FIELDS =
  'spend,impressions,clicks,ctr,actions,action_values,date_start,date_stop';
const CAMPAIGN_INSIGHT_FIELDS =
  'campaign_id,campaign_name,spend,reach,frequency,impressions,clicks,cpc,cpm,ctr,actions,action_values,date_start,date_stop';
const CAMPAIGN_FIELDS =
  'id,name,status,effective_status,daily_budget,lifetime_budget,start_time,stop_time';
const AD_ACCOUNT_FIELDS =
  'id,name,account_id,account_status,currency,amount_spent';
const DEFAULT_AD_ACCOUNT_ID = 'act_781471881330330';

@Injectable()
export class MetaAnalyticsService {
  private readonly logger = new Logger(MetaAnalyticsService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly companySettings: CompanySettingsService,
  ) {}

  async getAnalytics(
    period: MetaPeriodFilter = {},
    clientId?: string,
    adAccountId?: string,
  ): Promise<MetaAnalyticsSummary> {
    const accountId = await this.resolveAccountId(clientId, adAccountId);
    const accessToken = await this.resolveAccessToken();
    return this.fetchAccountSummary(accountId, period, accessToken);
  }

  async getAdAccounts(search?: string): Promise<MetaAdAccountsResponse> {
    const accessToken = await this.resolveAccessToken();
    const clients = await this.fetchAllAdAccounts(accessToken);
    const filtered = this.filterClientsBySearch(clients, search).sort(
      (a, b) => b.amountSpent - a.amountSpent,
    );

    return {
      clients: filtered,
      source: 'meta',
    };
  }

  async getClientInsights(
    clientId: string | undefined,
    period: MetaPeriodFilter = {},
  ): Promise<MetaClientInsightsResponse> {
    const accessToken = await this.resolveAccessToken();
    const accountId = await this.resolveAccountId(clientId);
    const account =
      (await this.fetchAdAccountDetail(accountId, accessToken)) ??
      this.buildFallbackClient(accountId);

    const client = this.mapAdAccountRow(account);
    const [overview, performance, campaigns] = await Promise.all([
      this.fetchAccountSummary(accountId, period, accessToken),
      this.fetchAccountDailyPerformance(accountId, period, accessToken),
      this.fetchCampaignInsights(accountId, period, accessToken),
    ]);

    const empty = this.isOverviewEmpty(overview) && campaigns.length === 0;

    return {
      client,
      overview,
      performance,
      campaigns,
      source: 'meta',
      empty,
    };
  }

  async getCampaigns(
    clientId: string | undefined,
    period: MetaPeriodFilter = {},
  ): Promise<MetaCampaignsResponse> {
    const accessToken = await this.resolveAccessToken();
    const accountId = await this.resolveAccountId(clientId);
    const campaigns = await this.fetchCampaignInsights(
      accountId,
      period,
      accessToken,
    );

    return {
      campaigns,
      source: 'meta',
      empty: campaigns.length === 0,
    };
  }

  async getAgencyOverview(
    period: MetaPeriodFilter = {},
    search?: string,
  ): Promise<MetaAgencyOverviewResponse> {
    const accessToken = await this.resolveAccessToken();
    const clients = this.filterClientsBySearch(
      await this.fetchAllAdAccounts(accessToken),
      search,
    ).sort((a, b) => b.amountSpent - a.amountSpent);

    const accounts: MetaAgencyAccountRow[] = [];

    for (const client of clients) {
      try {
        const overview = await this.fetchAccountSummary(
          client.id,
          period,
          accessToken,
        );
        accounts.push({
          client,
          overview,
          empty: this.isOverviewEmpty(overview),
        });
      } catch (error) {
        this.logger.warn(
          `Failed to load insights for ${client.id}: ${String(error)}`,
        );
        accounts.push({
          client,
          overview: this.buildEmptySummary(period),
          empty: true,
        });
      }
    }

    const totals = this.sumOverviews(
      accounts.map((item) => item.overview),
      period,
    );

    return {
      accounts,
      totals,
      source: 'meta',
      empty: accounts.every((item) => item.empty),
    };
  }

  private async fetchAllAdAccounts(
    accessToken: string,
  ): Promise<MetaAdAccountClient[]> {
    const clients: MetaAdAccountClient[] = [];
    let nextUrl: string | null = (() => {
      const url = new URL(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/me/adaccounts`,
      );
      url.searchParams.set('fields', AD_ACCOUNT_FIELDS);
      url.searchParams.set('limit', '50');
      url.searchParams.set('access_token', accessToken);
      return url.toString();
    })();

    while (nextUrl) {
      const payload = await this.fetchJson<MetaAdAccountsListResponse>(nextUrl);
      if (payload.error) {
        throw new ServiceUnavailableException(
          `Meta ad accounts error: ${payload.error.message}`,
        );
      }

      for (const account of payload.data ?? []) {
        clients.push(this.mapAdAccountRow(account));
      }

      nextUrl = payload.paging?.next ?? null;
    }

    return clients;
  }

  private async fetchAccountSummary(
    accountId: string,
    period: MetaPeriodFilter,
    accessToken: string,
  ): Promise<MetaAnalyticsSummary> {
    const url = this.buildInsightsUrl(accountId, accessToken, period);
    const payload = await this.fetchJson<MetaInsightsResponse>(url.toString());

    if (payload.error) {
      this.logger.warn(
        `Meta insights error for ${accountId}: ${payload.error.message}`,
      );
      return this.buildEmptySummary(period);
    }

    const row = payload.data?.[0];
    if (!row) {
      return this.buildEmptySummary(period);
    }

    return this.normalizeRow(row, period, 'meta');
  }

  private async fetchAccountDailyPerformance(
    accountId: string,
    period: MetaPeriodFilter,
    accessToken: string,
  ): Promise<MetaClientPerformancePoint[]> {
    const url = this.buildInsightsUrl(accountId, accessToken, period);
    url.searchParams.set('fields', DAILY_INSIGHT_FIELDS);
    url.searchParams.set('time_increment', '1');

    const payload = await this.fetchJson<MetaInsightsResponse>(url.toString());

    if (payload.error || !payload.data?.length) {
      return [];
    }

    return payload.data.map((row) => ({
      date: row.date_start ?? row.date_stop ?? '',
      spend: this.parseNumber(row.spend),
      impressions: this.parseNumber(row.impressions),
      clicks: this.parseNumber(row.clicks),
      revenue: this.extractRevenue(row.action_values),
      ctr: this.parseNumber(row.ctr),
      messagingConversations: this.extractActionValue(
        row.actions,
        'onsite_conversion.messaging_conversation_started_7d',
      ),
    }));
  }

  private async fetchCampaignInsights(
    accountId: string,
    period: MetaPeriodFilter,
    accessToken: string,
  ): Promise<MetaCampaignInsight[]> {
    const [insightRows, campaignMeta] = await Promise.all([
      this.fetchAllCampaignInsightRows(accountId, period, accessToken),
      this.fetchAllCampaignMeta(accountId, accessToken),
    ]);

    const metaById = new Map(
      campaignMeta.map((campaign) => [campaign.id, campaign]),
    );

    const campaigns = insightRows
      .filter((row) => row.campaign_id)
      .map((row) => {
        const meta = metaById.get(row.campaign_id!);
        return this.normalizeCampaignRow(row, meta);
      })
      .sort((a, b) => b.spend - a.spend);

    // Include campaigns with budget/status but no insights in the period
    for (const meta of campaignMeta) {
      if (campaigns.some((campaign) => campaign.id === meta.id)) continue;
      campaigns.push(this.normalizeCampaignMetaOnly(meta));
    }

    return campaigns.sort((a, b) => b.spend - a.spend);
  }

  private async fetchAllCampaignInsightRows(
    accountId: string,
    period: MetaPeriodFilter,
    accessToken: string,
  ): Promise<MetaInsightsRow[]> {
    const rows: MetaInsightsRow[] = [];
    const initialUrl = this.buildInsightsUrl(accountId, accessToken, period);
    initialUrl.searchParams.set('fields', CAMPAIGN_INSIGHT_FIELDS);
    initialUrl.searchParams.set('level', 'campaign');
    initialUrl.searchParams.set('limit', '100');

    let nextUrl: string | null = initialUrl.toString();

    while (nextUrl) {
      const payload = await this.fetchJson<MetaInsightsResponse>(nextUrl);

      if (payload.error) {
        this.logger.warn(
          `Meta campaign insights error for ${accountId}: ${payload.error.message}`,
        );
        break;
      }

      rows.push(...(payload.data ?? []));
      nextUrl = payload.paging?.next ?? null;
    }

    return rows;
  }

  private async fetchAllCampaignMeta(
    accountId: string,
    accessToken: string,
  ): Promise<MetaCampaignRow[]> {
    const campaigns: MetaCampaignRow[] = [];
    let nextUrl: string | null = (() => {
      const url = new URL(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${accountId}/campaigns`,
      );
      url.searchParams.set('fields', CAMPAIGN_FIELDS);
      url.searchParams.set('limit', '100');
      url.searchParams.set(
        'filtering',
        JSON.stringify([
          {
            field: 'effective_status',
            operator: 'IN',
            value: [
              'ACTIVE',
              'PAUSED',
              'CAMPAIGN_PAUSED',
              'IN_PROCESS',
              'WITH_ISSUES',
            ],
          },
        ]),
      );
      url.searchParams.set('access_token', accessToken);
      return url.toString();
    })();

    while (nextUrl) {
      const payload = await this.fetchJson<MetaCampaignsListResponse>(nextUrl);

      if (payload.error) {
        this.logger.warn(
          `Meta campaigns list error for ${accountId}: ${payload.error.message}`,
        );
        break;
      }

      for (const campaign of payload.data ?? []) {
        campaigns.push(campaign);
      }

      nextUrl = payload.paging?.next ?? null;
    }

    return campaigns;
  }

  private normalizeCampaignRow(
    row: MetaInsightsRow,
    meta?: MetaCampaignRow,
  ): MetaCampaignInsight {
    const spend = this.parseNumber(row.spend);
    const reach = this.parseNumber(row.reach);
    const frequency = this.parseNumber(row.frequency);
    const impressions = this.parseNumber(row.impressions);
    const clicks = this.parseNumber(row.clicks);
    const cpc = this.parseNumber(row.cpc);
    const cpm = this.parseNumber(row.cpm);
    const ctr = this.parseNumber(row.ctr);
    const revenue = this.extractRevenue(row.action_values);
    const conversions = this.extractConversions(row.actions);
    const messagingConversations = this.extractActionValue(
      row.actions,
      'onsite_conversion.messaging_conversation_started_7d',
    );
    const linkClicks = this.extractActionValue(row.actions, 'link_click');
    const { budget, budgetType } = this.resolveCampaignBudget(meta);
    const effectiveStatus = meta?.effective_status ?? meta?.status ?? 'UNKNOWN';

    return {
      id: row.campaign_id!,
      name: row.campaign_name ?? meta?.name ?? `Campanha ${row.campaign_id}`,
      status: this.mapCampaignStatus(effectiveStatus),
      effectiveStatus,
      budget,
      budgetType,
      spend,
      reach,
      frequency,
      impressions,
      clicks,
      cpc,
      cpm,
      ctr,
      conversions,
      revenue,
      roas: spend > 0 ? revenue / spend : 0,
      messagingConversations,
      linkClicks,
      periodStart: row.date_start ?? null,
      periodEnd: row.date_stop ?? null,
    };
  }

  private normalizeCampaignMetaOnly(meta: MetaCampaignRow): MetaCampaignInsight {
    const effectiveStatus = meta.effective_status ?? meta.status ?? 'UNKNOWN';
    const { budget, budgetType } = this.resolveCampaignBudget(meta);

    return {
      id: meta.id,
      name: meta.name,
      status: this.mapCampaignStatus(effectiveStatus),
      effectiveStatus,
      budget,
      budgetType,
      spend: 0,
      reach: 0,
      frequency: 0,
      impressions: 0,
      clicks: 0,
      cpc: 0,
      cpm: 0,
      ctr: 0,
      conversions: 0,
      revenue: 0,
      roas: 0,
      messagingConversations: 0,
      linkClicks: 0,
      periodStart: null,
      periodEnd: null,
    };
  }

  private resolveCampaignBudget(meta?: MetaCampaignRow) {
    if (!meta) {
      return { budget: 0, budgetType: null as 'daily' | 'lifetime' | null };
    }

    if (meta.daily_budget) {
      return {
        budget: this.parseCents(meta.daily_budget),
        budgetType: 'daily' as const,
      };
    }

    if (meta.lifetime_budget) {
      return {
        budget: this.parseCents(meta.lifetime_budget),
        budgetType: 'lifetime' as const,
      };
    }

    return { budget: 0, budgetType: null as 'daily' | 'lifetime' | null };
  }

  private mapCampaignStatus(effectiveStatus: string): MetaCampaignStatus {
    const normalized = effectiveStatus.toUpperCase();

    if (normalized === 'ACTIVE') return 'active';
    if (
      normalized === 'PAUSED' ||
      normalized === 'CAMPAIGN_PAUSED' ||
      normalized === 'ADSET_PAUSED'
    ) {
      return 'paused';
    }
    if (
      normalized === 'DELETED' ||
      normalized === 'ARCHIVED' ||
      normalized === 'COMPLETED'
    ) {
      return 'completed';
    }
    if (normalized === 'IN_PROCESS' || normalized === 'WITH_ISSUES') {
      return 'learning';
    }

    return 'unknown';
  }

  private extractConversions(
    actions?: Array<{ action_type: string; value: string }>,
  ) {
    if (!actions?.length) return 0;

    const conversionTypes = new Set([
      'purchase',
      'omni_purchase',
      'offsite_conversion.fb_pixel_purchase',
      'onsite_conversion.purchase',
      'lead',
      'complete_registration',
    ]);

    return actions.reduce((sum, action) => {
      if (!conversionTypes.has(action.action_type)) return sum;
      return sum + this.parseNumber(action.value);
    }, 0);
  }

  private async fetchAdAccountDetail(
    accountId: string,
    accessToken: string,
  ): Promise<MetaAdAccountRow | null> {
    const url = new URL(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${accountId}`,
    );
    url.searchParams.set('fields', AD_ACCOUNT_FIELDS);
    url.searchParams.set('access_token', accessToken);

    const payload = await this.fetchJson<MetaAdAccountDetailResponse>(
      url.toString(),
    );

    if (payload.error || !payload.id) {
      return null;
    }

    return {
      id: payload.id,
      name: payload.name ?? `Conta ${accountId}`,
      account_id: payload.account_id ?? accountId.replace(/^act_/, ''),
      account_status: payload.account_status ?? 0,
      currency: payload.currency ?? 'BRL',
      amount_spent: payload.amount_spent,
    };
  }

  private buildInsightsUrl(
    accountId: string,
    accessToken: string,
    period: MetaPeriodFilter,
  ) {
    const url = new URL(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${accountId}/insights`,
    );
    url.searchParams.set('fields', INSIGHT_FIELDS);
    url.searchParams.set('access_token', accessToken);

    const customRange = this.resolveCustomTimeRange(period);
    if (customRange) {
      url.searchParams.set('time_range', JSON.stringify(customRange));
    } else {
      url.searchParams.set(
        'date_preset',
        period.datePreset ?? 'last_90d',
      );
    }

    return url;
  }

  private resolveCustomTimeRange(period: MetaPeriodFilter) {
    if (!period.month || !period.year) return null;

    const start = new Date(Date.UTC(period.year, period.month - 1, 1));
    const end = new Date(Date.UTC(period.year, period.month, 0));

    return {
      since: start.toISOString().slice(0, 10),
      until: end.toISOString().slice(0, 10),
    };
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    return (await response.json()) as T;
  }

  private async resolveAccessToken() {
    try {
      const credentials =
        await this.companySettings.getIntegrationCredentialsForCurrentTenant();
      const tenantToken = credentials.metaPageAccessToken?.trim();
      if (tenantToken) {
        return tenantToken;
      }
    } catch {
    }

    const token = this.config.get<string>('META_ACCESS_TOKEN')?.trim();
    if (!token) {
      throw new BadRequestException(
        'Token de acesso Meta não configurado para esta empresa',
      );
    }
    return token;
  }

  private async resolveAccountId(clientId?: string, adAccountId?: string) {
    const candidate = clientId?.trim() || adAccountId?.trim();
    if (candidate) {
      return this.normalizeAccountId(candidate);
    }

    try {
      const credentials =
        await this.companySettings.getIntegrationCredentialsForCurrentTenant();
      const tenantAccountId = credentials.metaAdAccountId?.trim();
      if (tenantAccountId) {
        return this.normalizeAccountId(tenantAccountId);
      }
    } catch {
    }

    const envAccountId = this.config.get<string>('META_AD_ACCOUNT_ID')?.trim();
    if (envAccountId) {
      return this.normalizeAccountId(envAccountId);
    }

    return DEFAULT_AD_ACCOUNT_ID;
  }

  private normalizeAccountId(accountId: string) {
    const trimmed = accountId.trim();
    if (trimmed.startsWith('act_')) return trimmed;
    if (/^\d+$/.test(trimmed)) return `act_${trimmed}`;
    return trimmed;
  }

  private isAccountActive(accountStatus?: number) {
    return accountStatus === 1;
  }

  private mapAdAccountRow(account: MetaAdAccountRow): MetaAdAccountClient {
    return {
      id: account.id,
      accountId: account.account_id,
      name: account.name,
      accountStatus: account.account_status,
      currency: account.currency,
      amountSpent: this.parseCents(account.amount_spent),
      isActive: this.isAccountActive(account.account_status),
    };
  }

  private buildFallbackClient(accountId: string): MetaAdAccountRow {
    return {
      id: this.normalizeAccountId(accountId),
      name: `Conta ${accountId.replace(/^act_/, '')}`,
      account_id: accountId.replace(/^act_/, ''),
      account_status: 1,
      currency: 'BRL',
      amount_spent: '0',
    };
  }

  private filterClientsBySearch(
    clients: MetaAdAccountClient[],
    search?: string,
  ) {
    const query = search?.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.accountId.includes(query) ||
        client.id.toLowerCase().includes(query),
    );
  }

  private normalizeRow(
    row: MetaInsightsRow,
    period: MetaPeriodFilter,
    source: 'meta',
  ): MetaAnalyticsSummary {
    const totalSpend = this.parseNumber(row.spend);
    const impressions = this.parseNumber(row.impressions);
    const clicks = this.parseNumber(row.clicks);
    const cpc = this.parseNumber(row.cpc);
    const cpm = this.parseNumber(row.cpm);
    const ctr = this.parseNumber(row.ctr);
    const totalRevenue = this.extractRevenue(row.action_values);
    const netProfit = totalRevenue - totalSpend;
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const messagingConversations = this.extractActionValue(
      row.actions,
      'onsite_conversion.messaging_conversation_started_7d',
    );
    const linkClicks = this.extractActionValue(row.actions, 'link_click');
    const postEngagement = this.extractActionValue(
      row.actions,
      'post_engagement',
    );

    return {
      totalSpend,
      totalRevenue,
      netProfit,
      roas,
      cpc,
      cpm,
      ctr,
      clicks,
      impressions,
      messagingConversations,
      linkClicks,
      postEngagement,
      datePreset: period.month && period.year ? 'custom' : period.datePreset ?? 'last_90d',
      periodStart: row.date_start ?? null,
      periodEnd: row.date_stop ?? null,
      source,
    };
  }

  private extractRevenue(
    actionValues?: Array<{ action_type: string; value: string }>,
  ) {
    if (!actionValues?.length) return 0;

    const revenueTypes = new Set([
      'purchase',
      'omni_purchase',
      'offsite_conversion.fb_pixel_purchase',
      'onsite_conversion.purchase',
    ]);

    return actionValues.reduce((sum, action) => {
      if (!revenueTypes.has(action.action_type)) return sum;
      return sum + this.parseNumber(action.value);
    }, 0);
  }

  private extractActionValue(
    actions: Array<{ action_type: string; value: string }> | undefined,
    actionType: string,
  ) {
    if (!actions?.length) return 0;
    const match = actions.find((action) => action.action_type === actionType);
    return this.parseNumber(match?.value);
  }

  private parseNumber(value?: string) {
    if (!value) return 0;
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private parseCents(value?: string) {
    const cents = this.parseNumber(value);
    return Number((cents / 100).toFixed(2));
  }

  private isOverviewEmpty(overview: MetaAnalyticsSummary) {
    return (
      overview.totalSpend === 0 &&
      overview.impressions === 0 &&
      overview.clicks === 0 &&
      overview.messagingConversations === 0
    );
  }

  private buildEmptySummary(period: MetaPeriodFilter): MetaAnalyticsSummary {
    const customRange = this.resolveCustomTimeRange(period);
    return {
      totalSpend: 0,
      totalRevenue: 0,
      netProfit: 0,
      roas: 0,
      cpc: 0,
      cpm: 0,
      ctr: 0,
      clicks: 0,
      impressions: 0,
      messagingConversations: 0,
      linkClicks: 0,
      postEngagement: 0,
      datePreset: period.month && period.year ? 'custom' : period.datePreset ?? 'last_90d',
      periodStart: customRange?.since ?? null,
      periodEnd: customRange?.until ?? null,
      source: 'meta',
    };
  }

  private sumOverviews(
    overviews: MetaAnalyticsSummary[],
    period: MetaPeriodFilter,
  ): MetaAnalyticsSummary {
    const totals = this.buildEmptySummary(period);

    for (const item of overviews) {
      totals.totalSpend += item.totalSpend;
      totals.totalRevenue += item.totalRevenue;
      totals.clicks += item.clicks;
      totals.impressions += item.impressions;
      totals.messagingConversations += item.messagingConversations;
      totals.linkClicks += item.linkClicks;
      totals.postEngagement += item.postEngagement;
    }

    totals.netProfit = totals.totalRevenue - totals.totalSpend;
    totals.roas =
      totals.totalSpend > 0 ? totals.totalRevenue / totals.totalSpend : 0;
    totals.cpc = totals.clicks > 0 ? totals.totalSpend / totals.clicks : 0;
    totals.cpm =
      totals.impressions > 0
        ? (totals.totalSpend / totals.impressions) * 1000
        : 0;
    totals.ctr =
      totals.impressions > 0
        ? (totals.clicks / totals.impressions) * 100
        : 0;

    totals.totalSpend = Number(totals.totalSpend.toFixed(2));
    totals.totalRevenue = Number(totals.totalRevenue.toFixed(2));
    totals.netProfit = Number(totals.netProfit.toFixed(2));
    totals.roas = Number(totals.roas.toFixed(2));
    totals.cpc = Number(totals.cpc.toFixed(2));
    totals.cpm = Number(totals.cpm.toFixed(2));
    totals.ctr = Number(totals.ctr.toFixed(2));

    return totals;
  }
}
