import { CompaniesService } from './companies.service';
export declare class PublicCompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    findPrimary(): Promise<{
        id: string;
        name: string;
        subdomain: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    }>;
}
