import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type AdminClient = SupabaseClient<any, 'public', any>;

@Injectable()
export class SupabaseService implements OnModuleDestroy {
  private readonly client: AdminClient | null;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (url && serviceRoleKey) {
      this.client = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        db: {
          schema:
            this.configService.get<string>('SUPABASE_DB_SCHEMA') ?? 'public',
        },
      }) as AdminClient;
    } else {
      this.client = null;
    }
  }

  get admin(): AdminClient {
    if (!this.client) {
      throw new Error(
        'Supabase admin client is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      );
    }
    return this.client;
  }

  get isConfigured(): boolean {
    return this.client !== null;
  }

  async ping(): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    const { error } = await this.client.auth.getSession();
    return !error;
  }

  onModuleDestroy() {
    this.client?.removeAllChannels();
  }
}
