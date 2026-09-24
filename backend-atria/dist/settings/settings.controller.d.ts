import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { UpdateAppearanceDto } from './dto/appearance.dto';
import { UpdateBrandingDto } from './dto/branding.dto';
import { UpdateIntegrationsDto } from './dto/integrations.dto';
import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
    uploadBrandingAsset(type: 'logo' | 'favicon', file: Express.Multer.File): Promise<{
        agencyName: string;
        logoUrl: string | null;
        faviconUrl: string | null;
        primaryColor: string;
        accentColor: string;
        updatedAt: string;
    }>;
    getAppearance(user: AuthenticatedUser): Promise<{
        primaryColor: string;
        accentColor: string;
        backgroundColor: string;
        textColor: string;
        sidebarColor: string;
        updatedAt: string;
    }>;
    updateAppearance(user: AuthenticatedUser, dto: UpdateAppearanceDto): Promise<{
        primaryColor: string;
        accentColor: string;
        backgroundColor: string;
        textColor: string;
        sidebarColor: string;
        updatedAt: string;
    }>;
}
