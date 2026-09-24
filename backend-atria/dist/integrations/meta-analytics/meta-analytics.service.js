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
var MetaAnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const company_settings_service_1 = require("../../company-settings/company-settings.service");
const GRAPH_API_VERSION = 'v19.0';
const INSIGHT_FIELDS = 'spend,reach,frequency,impressions,clicks,cpc,cpm,ctr,actions,action_values';
const DAILY_INSIGHT_FIELDS = 'spend,impressions,clicks,ctr,actions,action_values,date_start,date_stop';
const CAMPAIGN_INSIGHT_FIELDS = 'campaign_id,campaign_name,spend,reach,frequency,impressions,clicks,cpc,cpm,ctr,actions,action_values,date_start,date_stop';
const CAMPAIGN_FIELDS = 'id,name,status,effective_status,daily_budget,lifetime_budget,start_time,stop_time';
const AD_ACCOUNT_FIELDS = 'id,name,account_id,account_status,currency,amount_spent';
const DEFAULT_AD_ACCOUNT_ID = 'act_781471881330330';
let MetaAnalyticsService = MetaAnalyticsService_1 = class MetaAnalyticsService {
    config;
    companySettings;
    logger = new common_1.Logger(MetaAnalyticsService_1.name);
    constructor(config, companySettings) {
        this.config = config;
        this.companySettings = companySettings;
    }
    async getAnalytics(period = {}, clientId, adAccountId) {
        const accountId = await this.resolveAccountId(clientId, adAccountId);
        const accessToken = await this.resolveAccessToken();
        return this.fetchAccountSummary(accountId, period, accessToken);
    }
    async getAdAccounts(search) {
        const accessToken = await this.resolveAccessToken();
        const clients = await this.fetchAllAdAccounts(accessToken);
        const filtered = this.filterClientsBySearch(clients, search).sort((a, b) => b.amountSpent - a.amountSpent);
        return {
            clients: filtered,
            source: 'meta',
        };
    }
    async getClientInsights(clientId, period = {}) {
        const accessToken = await this.resolveAccessToken();
        const accountId = await this.resolveAccountId(clientId);
        const account = (await this.fetchAdAccountDetail(accountId, accessToken)) ??
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
    async getCampaigns(clientId, period = {}) {
        const accessToken = await this.resolveAccessToken();
        const accountId = await this.resolveAccountId(clientId);
        const campaigns = await this.fetchCampaignInsights(accountId, period, accessToken);
        return {
            campaigns,
            source: 'meta',
            empty: campaigns.length === 0,
        };
    }
    async getAgencyOverview(period = {}, search) {
        const accessToken = await this.resolveAccessToken();
        const clients = this.filterClientsBySearch(await this.fetchAllAdAccounts(accessToken), search).sort((a, b) => b.amountSpent - a.amountSpent);
        const accounts = [];
        for (const client of clients) {
            try {
                const overview = await this.fetchAccountSummary(client.id, period, accessToken);
                accounts.push({
                    client,
                    overview,
                    empty: this.isOverviewEmpty(overview),
                });
            }
            catch (error) {
                this.logger.warn(`Failed to load insights for ${client.id}: ${String(error)}`);
                accounts.push({
                    client,
                    overview: this.buildEmptySummary(period),
                    empty: true,
                });
            }
        }
        const totals = this.sumOverviews(accounts.map((item) => item.overview), period);
        return {
            accounts,
            totals,
            source: 'meta',
            empty: accounts.every((item) => item.empty),
        };
    }
    async fetchAllAdAccounts(accessToken) {
        const clients = [];
        let nextUrl = (() => {
            const url = new URL(`https://graph.facebook.com/${GRAPH_API_VERSION}/me/adaccounts`);
            url.searchParams.set('fields', AD_ACCOUNT_FIELDS);
            url.searchParams.set('limit', '50');
            url.searchParams.set('access_token', accessToken);
            return url.toString();
        })();
        while (nextUrl) {
            const payload = await this.fetchJson(nextUrl);
            if (payload.error) {
                throw new common_1.ServiceUnavailableException(`Meta ad accounts error: ${payload.error.message}`);
            }
            for (const account of payload.data ?? []) {
                clients.push(this.mapAdAccountRow(account));
            }
            nextUrl = payload.paging?.next ?? null;
        }
        return clients;
    }
    async fetchAccountSummary(accountId, period, accessToken) {
        const url = this.buildInsightsUrl(accountId, accessToken, period);
        const payload = await this.fetchJson(url.toString());
        if (payload.error) {
            this.logger.warn(`Meta insights error for ${accountId}: ${payload.error.message}`);
            return this.buildEmptySummary(period);
        }
        const row = payload.data?.[0];
        if (!row) {
            return this.buildEmptySummary(period);
        }
        return this.normalizeRow(row, period, 'meta');
    }
    async fetchAccountDailyPerformance(accountId, period, accessToken) {
        const url = this.buildInsightsUrl(accountId, accessToken, period);
        url.searchParams.set('fields', DAILY_INSIGHT_FIELDS);
        url.searchParams.set('time_increment', '1');
        const payload = await this.fetchJson(url.toString());
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
            messagingConversations: this.extractActionValue(row.actions, 'onsite_conversion.messaging_conversation_started_7d'),
        }));
    }
    async fetchCampaignInsights(accountId, period, accessToken) {
        const [insightRows, campaignMeta] = await Promise.all([
            this.fetchAllCampaignInsightRows(accountId, period, accessToken),
            this.fetchAllCampaignMeta(accountId, accessToken),
        ]);
        const metaById = new Map(campaignMeta.map((campaign) => [campaign.id, campaign]));
        const campaigns = insightRows
            .filter((row) => row.campaign_id)
            .map((row) => {
            const meta = metaById.get(row.campaign_id);
            return this.normalizeCampaignRow(row, meta);
        })
            .sort((a, b) => b.spend - a.spend);
        for (const meta of campaignMeta) {
            if (campaigns.some((campaign) => campaign.id === meta.id))
                continue;
            campaigns.push(this.normalizeCampaignMetaOnly(meta));
        }
        return campaigns.sort((a, b) => b.spend - a.spend);
    }
    async fetchAllCampaignInsightRows(accountId, period, accessToken) {
        const rows = [];
        const initialUrl = this.buildInsightsUrl(accountId, accessToken, period);
        initialUrl.searchParams.set('fields', CAMPAIGN_INSIGHT_FIELDS);
        initialUrl.searchParams.set('level', 'campaign');
        initialUrl.searchParams.set('limit', '100');
        let nextUrl = initialUrl.toString();
        while (nextUrl) {
            const payload = await this.fetchJson(nextUrl);
            if (payload.error) {
                this.logger.warn(`Meta campaign insights error for ${accountId}: ${payload.error.message}`);
                break;
            }
            rows.push(...(payload.data ?? []));
            nextUrl = payload.paging?.next ?? null;
        }
        return rows;
    }
    async fetchAllCampaignMeta(accountId, accessToken) {
        const campaigns = [];
        let nextUrl = (() => {
            const url = new URL(`https://graph.facebook.com/${GRAPH_API_VERSION}/${accountId}/campaigns`);
            url.searchParams.set('fields', CAMPAIGN_FIELDS);
            url.searchParams.set('limit', '100');
            url.searchParams.set('filtering', JSON.stringify([
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
            ]));
            url.searchParams.set('access_token', accessToken);
            return url.toString();
        })();
        while (nextUrl) {
            const payload = await this.fetchJson(nextUrl);
            if (payload.error) {
                this.logger.warn(`Meta campaigns list error for ${accountId}: ${payload.error.message}`);
                break;
            }
            for (const campaign of payload.data ?? []) {
                campaigns.push(campaign);
            }
            nextUrl = payload.paging?.next ?? null;
        }
        return campaigns;
    }
    normalizeCampaignRow(row, meta) {
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
        const messagingConversations = this.extractActionValue(row.actions, 'onsite_conversion.messaging_conversation_started_7d');
        const linkClicks = this.extractActionValue(row.actions, 'link_click');
        const { budget, budgetType } = this.resolveCampaignBudget(meta);
        const effectiveStatus = meta?.effective_status ?? meta?.status ?? 'UNKNOWN';
        return {
            id: row.campaign_id,
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
    normalizeCampaignMetaOnly(meta) {
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
    resolveCampaignBudget(meta) {
        if (!meta) {
            return { budget: 0, budgetType: null };
        }
        if (meta.daily_budget) {
            return {
                budget: this.parseCents(meta.daily_budget),
                budgetType: 'daily',
            };
        }
        if (meta.lifetime_budget) {
            return {
                budget: this.parseCents(meta.lifetime_budget),
                budgetType: 'lifetime',
            };
        }
        return { budget: 0, budgetType: null };
    }
    mapCampaignStatus(effectiveStatus) {
        const normalized = effectiveStatus.toUpperCase();
        if (normalized === 'ACTIVE')
            return 'active';
        if (normalized === 'PAUSED' ||
            normalized === 'CAMPAIGN_PAUSED' ||
            normalized === 'ADSET_PAUSED') {
            return 'paused';
        }
        if (normalized === 'DELETED' ||
            normalized === 'ARCHIVED' ||
            normalized === 'COMPLETED') {
            return 'completed';
        }
        if (normalized === 'IN_PROCESS' || normalized === 'WITH_ISSUES') {
            return 'learning';
        }
        return 'unknown';
    }
    extractConversions(actions) {
        if (!actions?.length)
            return 0;
        const conversionTypes = new Set([
            'purchase',
            'omni_purchase',
            'offsite_conversion.fb_pixel_purchase',
            'onsite_conversion.purchase',
            'lead',
            'complete_registration',
        ]);
        return actions.reduce((sum, action) => {
            if (!conversionTypes.has(action.action_type))
                return sum;
            return sum + this.parseNumber(action.value);
        }, 0);
    }
    async fetchAdAccountDetail(accountId, accessToken) {
        const url = new URL(`https://graph.facebook.com/${GRAPH_API_VERSION}/${accountId}`);
        url.searchParams.set('fields', AD_ACCOUNT_FIELDS);
        url.searchParams.set('access_token', accessToken);
        const payload = await this.fetchJson(url.toString());
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
    buildInsightsUrl(accountId, accessToken, period) {
        const url = new URL(`https://graph.facebook.com/${GRAPH_API_VERSION}/${accountId}/insights`);
        url.searchParams.set('fields', INSIGHT_FIELDS);
        url.searchParams.set('access_token', accessToken);
        const customRange = this.resolveCustomTimeRange(period);
        if (customRange) {
            url.searchParams.set('time_range', JSON.stringify(customRange));
        }
        else {
            url.searchParams.set('date_preset', period.datePreset ?? 'last_90d');
        }
        return url;
    }
    resolveCustomTimeRange(period) {
        if (!period.month || !period.year)
            return null;
        const start = new Date(Date.UTC(period.year, period.month - 1, 1));
        const end = new Date(Date.UTC(period.year, period.month, 0));
        return {
            since: start.toISOString().slice(0, 10),
            until: end.toISOString().slice(0, 10),
        };
    }
    async fetchJson(url) {
        const response = await fetch(url);
        return (await response.json());
    }
    async resolveAccessToken() {
        try {
            const credentials = await this.companySettings.getIntegrationCredentialsForCurrentTenant();
            const tenantToken = credentials.metaPageAccessToken?.trim();
            if (tenantToken) {
                return tenantToken;
            }
        }
        catch {
        }
        const token = this.config.get('META_ACCESS_TOKEN')?.trim();
        if (!token) {
            throw new common_1.BadRequestException('Token de acesso Meta não configurado para esta empresa');
        }
        return token;
    }
    async resolveAccountId(clientId, adAccountId) {
        const candidate = clientId?.trim() || adAccountId?.trim();
        if (candidate) {
            return this.normalizeAccountId(candidate);
        }
        try {
            const credentials = await this.companySettings.getIntegrationCredentialsForCurrentTenant();
            const tenantAccountId = credentials.metaAdAccountId?.trim();
            if (tenantAccountId) {
                return this.normalizeAccountId(tenantAccountId);
            }
        }
        catch {
        }
        const envAccountId = this.config.get('META_AD_ACCOUNT_ID')?.trim();
        if (envAccountId) {
            return this.normalizeAccountId(envAccountId);
        }
        return DEFAULT_AD_ACCOUNT_ID;
    }
    normalizeAccountId(accountId) {
        const trimmed = accountId.trim();
        if (trimmed.startsWith('act_'))
            return trimmed;
        if (/^\d+$/.test(trimmed))
            return `act_${trimmed}`;
        return trimmed;
    }
    isAccountActive(accountStatus) {
        return accountStatus === 1;
    }
    mapAdAccountRow(account) {
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
    buildFallbackClient(accountId) {
        return {
            id: this.normalizeAccountId(accountId),
            name: `Conta ${accountId.replace(/^act_/, '')}`,
            account_id: accountId.replace(/^act_/, ''),
            account_status: 1,
            currency: 'BRL',
            amount_spent: '0',
        };
    }
    filterClientsBySearch(clients, search) {
        const query = search?.trim().toLowerCase();
        if (!query)
            return clients;
        return clients.filter((client) => client.name.toLowerCase().includes(query) ||
            client.accountId.includes(query) ||
            client.id.toLowerCase().includes(query));
    }
    normalizeRow(row, period, source) {
        const totalSpend = this.parseNumber(row.spend);
        const impressions = this.parseNumber(row.impressions);
        const clicks = this.parseNumber(row.clicks);
        const cpc = this.parseNumber(row.cpc);
        const cpm = this.parseNumber(row.cpm);
        const ctr = this.parseNumber(row.ctr);
        const totalRevenue = this.extractRevenue(row.action_values);
        const netProfit = totalRevenue - totalSpend;
        const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
        const messagingConversations = this.extractActionValue(row.actions, 'onsite_conversion.messaging_conversation_started_7d');
        const linkClicks = this.extractActionValue(row.actions, 'link_click');
        const postEngagement = this.extractActionValue(row.actions, 'post_engagement');
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
    extractRevenue(actionValues) {
        if (!actionValues?.length)
            return 0;
        const revenueTypes = new Set([
            'purchase',
            'omni_purchase',
            'offsite_conversion.fb_pixel_purchase',
            'onsite_conversion.purchase',
        ]);
        return actionValues.reduce((sum, action) => {
            if (!revenueTypes.has(action.action_type))
                return sum;
            return sum + this.parseNumber(action.value);
        }, 0);
    }
    extractActionValue(actions, actionType) {
        if (!actions?.length)
            return 0;
        const match = actions.find((action) => action.action_type === actionType);
        return this.parseNumber(match?.value);
    }
    parseNumber(value) {
        if (!value)
            return 0;
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    parseCents(value) {
        const cents = this.parseNumber(value);
        return Number((cents / 100).toFixed(2));
    }
    isOverviewEmpty(overview) {
        return (overview.totalSpend === 0 &&
            overview.impressions === 0 &&
            overview.clicks === 0 &&
            overview.messagingConversations === 0);
    }
    buildEmptySummary(period) {
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
    sumOverviews(overviews, period) {
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
};
exports.MetaAnalyticsService = MetaAnalyticsService;
exports.MetaAnalyticsService = MetaAnalyticsService = MetaAnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        company_settings_service_1.CompanySettingsService])
], MetaAnalyticsService);
//# sourceMappingURL=meta-analytics.service.js.map