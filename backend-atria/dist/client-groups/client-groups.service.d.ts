import { PrismaService } from '../prisma/prisma.service';
import { CreateClientGroupDto, UpdateClientGroupDto } from './dto/client-group.dto';
export declare class ClientGroupsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        description: string | null;
        color: string;
        clientCount: number;
        createdAt: string;
        updatedAt: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        color: string;
        clientCount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    create(dto: CreateClientGroupDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        color: string;
        clientCount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: string, dto: UpdateClientGroupDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        color: string;
        clientCount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(id: string): Promise<void>;
    bulkImport(dto: {
        groups: CreateClientGroupDto[];
    }): Promise<{
        created: number;
        errors: {
            index: number;
            message: string;
        }[];
    }>;
    private ensureExists;
    private toResponse;
    private isUniqueConstraintError;
}
