"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_service_1 = require("../supabase/supabase.service");
let HealthService = class HealthService {
    prisma;
    supabase;
    configService;
    constructor(prisma, supabase, configService) {
        this.prisma = prisma;
        this.supabase = supabase;
        this.configService = configService;
    }
    async check() {
        const schema = this.configService.get('SUPABASE_DB_SCHEMA') ?? 'public';
        const database = await this.checkDatabase();
        const supabase = await this.checkSupabase();
        let status = 'ok';
        if (database.status === 'down') {
            status = 'error';
        }
        else if (supabase.configured && supabase.status === 'down') {
            status = 'degraded';
        }
        return {
            status,
            timestamp: new Date().toISOString(),
            database: {
                ...database,
                schema,
            },
            supabase,
        };
    }
    async checkDatabase() {
        const startedAt = Date.now();
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                status: 'up',
                latencyMs: Date.now() - startedAt,
            };
        }
        catch {
            return {
                status: 'down',
                latencyMs: null,
            };
        }
    }
    async checkSupabase() {
        if (!this.supabase.isConfigured) {
            return {
                configured: false,
                status: 'skipped',
            };
        }
        const ok = await this.supabase.ping();
        return {
            configured: true,
            status: ok ? 'up' : 'down',
        };
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService,
        config_1.ConfigService])
], HealthService);
//# sourceMappingURL=health.service.js.map