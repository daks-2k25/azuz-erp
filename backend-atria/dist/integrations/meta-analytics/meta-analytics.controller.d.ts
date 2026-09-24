import { QueryMetaAnalyticsDto } from './dto/query-meta-analytics.dto';
import { MetaAnalyticsService } from './meta-analytics.service';
export declare class MetaAnalyticsController {
    private readonly metaAnalyticsService;
    constructor(metaAnalyticsService: MetaAnalyticsService);
    getAnalytics(query: QueryMetaAnalyticsDto): Promise<import("./meta-analytics.service").MetaAnalyticsSummary>;
    getAdAccounts(query: QueryMetaAnalyticsDto): Promise<import("./meta-analytics.service").MetaAdAccountsResponse>;
    getAgencyOverview(query: QueryMetaAnalyticsDto): Promise<import("./meta-analytics.service").MetaAgencyOverviewResponse>;
    getClientInsights(clientId: string, query: QueryMetaAnalyticsDto): Promise<import("./meta-analytics.service").MetaClientInsightsResponse>;
    getClientCampaigns(clientId: string, query: QueryMetaAnalyticsDto): Promise<import("./meta-analytics.service").MetaCampaignsResponse>;
}
