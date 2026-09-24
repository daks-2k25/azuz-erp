import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
export type HealthStatus = 'ok' | 'degraded' | 'error';
export interface HealthCheckResult {
    status: HealthStatus;
    timestamp: string;
    database: {
        status: 'up' | 'down';
        latencyMs: number | null;
        schema: string;
    };
    supabase: {
        configured: boolean;
        status: 'up' | 'down' | 'skipped';
    };
}
export declare class HealthService {
    private readonly prisma;
    private readonly supabase;
    private readonly configService;
    constructor(prisma: PrismaService, supabase: SupabaseService, configService: ConfigService);
    check(): Promise<HealthCheckResult>;
    private checkDatabase;
    private checkSupabase;
}
