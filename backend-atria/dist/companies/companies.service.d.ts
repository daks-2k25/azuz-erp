import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
export declare class CompaniesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findPrimary(): Promise<{
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
    private toResponse;
}
