import { CompanyStatus } from '@prisma/client';
export declare class CreateCompanyDto {
    name: string;
    subdomain: string;
}
export declare class UpdateCompanyDto {
    name?: string;
    status?: CompanyStatus;
}
