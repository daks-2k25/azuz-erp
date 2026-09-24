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
export declare class MetaInsightsService {
    private campaigns;
    getOverview(): {
        reach: number;
        impressions: number;
        totalSpend: number;
        roas: number;
        engagementRate: number;
        activeCampaigns: number;
        totalConversions: number;
    };
    getPerformanceChart(): {
        date: string;
        spend: number;
        conversions: number;
    }[];
    getCampaigns(): {
        id: string;
        name: string;
        status: CampaignStatus;
        budget: number;
        budgetType: "daily" | "lifetime";
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
    }[];
    updateCampaignStatus(id: string, status: CampaignStatus): {
        id: string;
        name: string;
        status: CampaignStatus;
        budget: number;
        budgetType: "daily" | "lifetime";
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
    };
    getClientMonthlyMetrics(clientId: string, month: number, year: number): {
        reach: number;
        impressions: number;
        spend: number;
        engagement: number;
        engagementRate: number;
        conversions: number;
        roas: number;
        activeCampaigns: number;
        performanceChart: {
            date: string;
            spend: number;
            reach: number;
            engagement: number;
        }[];
    };
    getPostInsights(postId: string, clientId: string): {
        postId: string;
        clientId: string;
        reach: number;
        impressions: number;
        engagement: number;
        engagementRate: number;
        platform: "instagram";
        isEstimated: boolean;
    };
    getClientInsights(clientId: string): {
        reach: number;
        impressions: number;
        spend: number;
        engagement: number;
        engagementRate: number;
        conversions: number;
        roas: number;
        activeCampaigns: number;
        performanceChart: {
            date: string;
            spend: number;
            reach: number;
            engagement: number;
        }[];
    };
    private hashClientPeriod;
    private seededRandom;
    private buildCampaigns;
}
