"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const SALT_ROUNDS = 12;
let PortalAuthService = class PortalAuthService {
    prisma;
    jwtService;
    configService;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async login(dto) {
        const portalUser = await this.prisma.clientPortalUser.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
            include: {
                client: { select: { id: true, companyName: true, isActive: true } },
            },
        });
        if (!portalUser) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        if (!portalUser.client.isActive) {
            throw new common_1.UnauthorizedException('Conta do cliente desativada');
        }
        const valid = await bcrypt.compare(dto.password, portalUser.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const tokens = await this.generateTokens(portalUser.id, portalUser.clientId, portalUser.email);
        await this.storeRefreshToken(portalUser.id, tokens.refreshToken);
        return {
            client: portalUser.client,
            mustChangePassword: portalUser.mustChangePassword,
            ...tokens,
        };
    }
    async refresh(refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        const stored = await this.prisma.clientPortalAuthToken.findUnique({
            where: { tokenHash },
            include: {
                portalUser: {
                    include: {
                        client: { select: { id: true, companyName: true, isActive: true } },
                    },
                },
            },
        });
        if (!stored || stored.expiresAt < new Date()) {
            if (stored) {
                await this.prisma.clientPortalAuthToken.delete({ where: { id: stored.id } });
            }
            throw new common_1.UnauthorizedException('Sessão expirada');
        }
        await this.prisma.clientPortalAuthToken.delete({ where: { id: stored.id } });
        const { portalUser } = stored;
        if (!portalUser.client.isActive) {
            throw new common_1.UnauthorizedException('Conta do cliente desativada');
        }
        const tokens = await this.generateTokens(portalUser.id, portalUser.clientId, portalUser.email);
        await this.storeRefreshToken(portalUser.id, tokens.refreshToken);
        return {
            client: portalUser.client,
            mustChangePassword: portalUser.mustChangePassword,
            ...tokens,
        };
    }
    async logout(refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        await this.prisma.clientPortalAuthToken.deleteMany({ where: { tokenHash } });
    }
    async provisionPortalAccess(clientId, password) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
            select: { id: true, companyName: true, email: true, contactName: true },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        if (!client.email?.trim()) {
            throw new common_1.BadRequestException('O cliente precisa ter um e-mail cadastrado para acessar o portal');
        }
        const temporaryPassword = password?.trim() || this.generateTemporaryPassword();
        const passwordHash = await bcrypt.hash(temporaryPassword, SALT_ROUNDS);
        const portalUser = await this.prisma.clientPortalUser.upsert({
            where: { clientId },
            create: {
                clientId,
                email: client.email.toLowerCase().trim(),
                passwordHash,
                temporaryPassword,
                mustChangePassword: true,
            },
            update: {
                email: client.email.toLowerCase().trim(),
                passwordHash,
                temporaryPassword,
                mustChangePassword: true,
            },
            include: { client: { select: { id: true, companyName: true } } },
        });
        return {
            clientId: portalUser.clientId,
            companyName: portalUser.client.companyName,
            email: portalUser.email,
            temporaryPassword,
            loginUrl: '/portal/login',
        };
    }
    async getPortalUserFromAccessToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
            });
            if (payload.type !== 'portal') {
                throw new common_1.UnauthorizedException('Invalid portal token');
            }
            const portalUser = await this.prisma.clientPortalUser.findUnique({
                where: { id: payload.sub },
                select: { id: true, clientId: true, email: true, mustChangePassword: true },
            });
            if (!portalUser) {
                throw new common_1.UnauthorizedException('Portal user not found');
            }
            return portalUser;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired portal session');
        }
    }
    async generateTokens(portalUserId, clientId, email) {
        const payload = {
            sub: portalUserId,
            clientId,
            email,
            type: 'portal',
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION', '15m'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async storeRefreshToken(portalUserId, refreshToken) {
        await this.prisma.clientPortalAuthToken.create({
            data: {
                portalUserId,
                tokenHash: this.hashToken(refreshToken),
                expiresAt: this.getRefreshExpirationDate(),
            },
        });
    }
    hashToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
    getRefreshExpirationDate() {
        const expiration = this.configService.get('JWT_REFRESH_EXPIRATION', '7d');
        const match = expiration.match(/^(\d+)([dhms])$/);
        if (!match)
            return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const value = parseInt(match[1], 10);
        const multipliers = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        };
        return new Date(Date.now() + value * multipliers[match[2]]);
    }
    generateTemporaryPassword() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
        const bytes = (0, crypto_1.randomBytes)(12);
        return Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
    }
};
exports.PortalAuthService = PortalAuthService;
exports.PortalAuthService = PortalAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], PortalAuthService);
//# sourceMappingURL=portal-auth.service.js.map