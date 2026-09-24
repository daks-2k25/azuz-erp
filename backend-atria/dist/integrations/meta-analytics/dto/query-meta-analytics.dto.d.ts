export declare const META_DATE_PRESETS: readonly ["today", "yesterday", "last_7d", "last_14d", "last_28d", "last_30d", "last_90d", "this_month", "last_month", "this_quarter", "this_year", "last_year", "maximum"];
export type MetaDatePreset = (typeof META_DATE_PRESETS)[number];
export declare class QueryMetaAnalyticsDto {
    datePreset?: MetaDatePreset;
    clientId?: string;
    adAccountId?: string;
    month?: number;
    year?: number;
    search?: string;
}
