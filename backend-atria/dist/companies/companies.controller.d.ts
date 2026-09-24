import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    findAll(): Promise<{
        id: string;
        name: string;
        subdomain: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        subdomain: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    }>;
    create(dto: CreateCompanyDto): Promise<{
        id: string;
        name: string;
        subdomain: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: string, dto: UpdateCompanyDto): Promise<{
        id: string;
        name: string;
        subdomain: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    }>;
}
