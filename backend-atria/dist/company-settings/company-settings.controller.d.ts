import { CompanySettingsService } from './company-settings.service';
import { UpdateCompanyIntegrationsDto } from './dto/update-company-integrations.dto';
import { UpdateCompanySettingsDto } from './dto/update-company-settings.dto';
export declare class CompanySettingsController {
    private readonly companySettingsService;
    constructor(companySettingsService: CompanySettingsService);
    getSettings(): Promise<import("./company-settings.service").CompanySettingsResponse>;
    updateSettings(dto: UpdateCompanySettingsDto): Promise<import("./company-settings.service").CompanySettingsResponse>;
    getIntegrations(): Promise<import("./company-settings.service").CompanyIntegrationsResponse>;
    updateIntegrations(dto: UpdateCompanyIntegrationsDto): Promise<import("./company-settings.service").CompanyIntegrationsResponse>;
}
