import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type SupabaseClient } from '@supabase/supabase-js';
type AdminClient = SupabaseClient<any, 'public', any>;
export declare class SupabaseService implements OnModuleDestroy {
    private readonly configService;
    private readonly client;
    constructor(configService: ConfigService);
    get admin(): AdminClient;
    get isConfigured(): boolean;
    ping(): Promise<boolean>;
    onModuleDestroy(): void;
}
export {};
