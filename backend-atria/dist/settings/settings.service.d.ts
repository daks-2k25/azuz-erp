import { PrismaService } from '../prisma/prisma.service';
import { SupabaseStorageService } from '../supabase/supabase-storage.service';
import { UpdateAppearanceDto } from './dto/appearance.dto';
import { UpdateBrandingDto } from './dto/branding.dto';
import { UpdateIntegrationsDto } from './dto/integrations.dto';
export declare const DEFAULT_APPEARANCE: {
    readonly primaryColor: "#004949";
    readonly accentColor: "#E8C39E";
    readonly backgroundColor: "#FFFFFF";
    readonly textColor: "#0F172A";
    readonly sidebarColor: "#004949";
};
export declare const DEFAULT_BRANDING: {
    readonly agencyName: "ATRIA ERP";
    readonly logoUrl: string | null;
    readonly faviconUrl: string | null;
    readonly primaryColor: "#004949";
    readonly accentColor: "#E8C39E";
};
export declare class SettingsService {
    private readonly prisma;
    private readonly storage;
    constructor(prisma: PrismaService, storage: SupabaseStorageService);
    getAppearance(userId: string): Promise<{
        primaryColor: string;
        accentColor: string;
        backgroundColor: string;
        textColor: string;
        sidebarColor: string;
        updatedAt: string;
    }>;
    updateAppearance(userId: string, dto: UpdateAppearanceDto): Promise<{
        primaryColor: string;
        accentColor: string;
        backgroundColor: string;
        textColor: string;
        sidebarColor: string;
        updatedAt: string;
    }>;
    getBranding(): Promise<{
        agencyName: string;
        logoUrl: string | null;
        faviconUrl: string | null;
        primaryColor: string;
        accentColor: string;
        updatedAt: string;
    }>;
    updateBranding(dto: UpdateBrandingDto): Promise<{
        agencyName: string;
        logoUrl: string | null;
        faviconUrl: string | null;
        primaryColor: string;
        accentColor: string;
        updatedAt: string;
    }>;
    getIntegrations(): Promise<{
        slackWebhookUrl: string | null;
        discordWebhookUrl: string | null;
        notifyOnPostRejected: boolean;
        notifyOnContractSigned: boolean;
        updatedAt: string;
    }>;
    updateIntegrations(dto: UpdateIntegrationsDto): Promise<{
        slackWebhookUrl: string | null;
        discordWebhookUrl: string | null;
        notifyOnPostRejected: boolean;
        notifyOnContractSigned: boolean;
        updatedAt: string;
    }>;
    updateBrandingAsset(type: 'logo' | 'favicon', fileUrl: string): Promise<{
        agencyName: string;
        logoUrl: string | null;
        faviconUrl: string | null;
        primaryColor: string;
        accentColor: string;
        updatedAt: string;
    }>;
    uploadBrandingAsset(type: 'logo' | 'favicon', file: Express.Multer.File): Promise<{
        agencyName: string;
        logoUrl: string | null;
        faviconUrl: string | null;
        primaryColor: string;
        accentColor: string;
        updatedAt: string;
    }>;
    private persistBrandingFile;
    private toAppearanceResponse;
    private toBrandingResponse;
    private toIntegrationsResponse;
}
