import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';
import { MetaInsightsService } from './meta-insights.service';
export declare class MetaInsightsController {
    private readonly metaInsightsService;
    constructor(metaInsightsService: MetaInsightsService);
    getOverview(): {
        reach: number;
        impressions: number;
        totalSpend: number;
        roas: number;
        engagementRate: number;
        activeCampaigns: number;
        totalConversions: number;
    };
    getPerformance(): {
        date: string;
        spend: number;
        conversions: number;
    }[];
    getCampaigns(): {
        id: string;
        name: string;
        status: import("./meta-insights.service").CampaignStatus;
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
    updateCampaign(id: string, dto: UpdateCampaignStatusDto): {
        id: string;
        name: string;
        status: import("./meta-insights.service").CampaignStatus;
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
}
