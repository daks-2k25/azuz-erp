import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PortalLoginDto } from './dto/portal-auth.dto';

const SALT_ROUNDS = 12;

export interface PortalJwtPayload {
  sub: string;
  clientId: string;
  email: string;
  type: 'portal';
}

@Injectable()
export class PortalAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: PortalLoginDto) {
    const portalUser = await this.prisma.clientPortalUser.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: {
        client: { select: { id: true, companyName: true, isActive: true } },
      },
    });

    if (!portalUser) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!portalUser.client.isActive) {
      throw new UnauthorizedException('Conta do cliente desativada');
    }

    const valid = await bcrypt.compare(dto.password, portalUser.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const tokens = await this.generateTokens(
      portalUser.id,
      portalUser.clientId,
      portalUser.email,
    );
    await this.storeRefreshToken(portalUser.id, tokens.refreshToken);

    return {
      client: portalUser.client,
      mustChangePassword: portalUser.mustChangePassword,
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
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
      throw new UnauthorizedException('Sessão expirada');
    }

    await this.prisma.clientPortalAuthToken.delete({ where: { id: stored.id } });

    const { portalUser } = stored;
    if (!portalUser.client.isActive) {
      throw new UnauthorizedException('Conta do cliente desativada');
    }
    const tokens = await this.generateTokens(
      portalUser.id,
      portalUser.clientId,
      portalUser.email,
    );
    await this.storeRefreshToken(portalUser.id, tokens.refreshToken);

    return {
      client: portalUser.client,
      mustChangePassword: portalUser.mustChangePassword,
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.clientPortalAuthToken.deleteMany({ where: { tokenHash } });
  }

  async provisionPortalAccess(clientId: string, password?: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, companyName: true, email: true, contactName: true },
    });

    if (!client) throw new NotFoundException('Client not found');
    if (!client.email?.trim()) {
      throw new BadRequestException(
        'O cliente precisa ter um e-mail cadastrado para acessar o portal',
      );
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

  async getPortalUserFromAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<PortalJwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });

      if (payload.type !== 'portal') {
        throw new UnauthorizedException('Invalid portal token');
      }

      const portalUser = await this.prisma.clientPortalUser.findUnique({
        where: { id: payload.sub },
        select: { id: true, clientId: true, email: true, mustChangePassword: true },
      });

      if (!portalUser) {
        throw new UnauthorizedException('Portal user not found');
      }

      return portalUser;
    } catch {
      throw new UnauthorizedException('Invalid or expired portal session');
    }
  }

  private async generateTokens(
    portalUserId: string,
    clientId: string,
    email: string,
  ) {
    const payload: PortalJwtPayload = {
      sub: portalUserId,
      clientId,
      email,
      type: 'portal',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(portalUserId: string, refreshToken: string) {
    await this.prisma.clientPortalAuthToken.create({
      data: {
        portalUserId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: this.getRefreshExpirationDate(),
      },
    });
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private getRefreshExpirationDate(): Date {
    const expiration = this.configService.get('JWT_REFRESH_EXPIRATION', '7d');
    const match = expiration.match(/^(\d+)([dhms])$/);
    if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const value = parseInt(match[1], 10);
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return new Date(Date.now() + value * multipliers[match[2]]);
  }

  private generateTemporaryPassword(): string {
    const chars =
      'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    const bytes = randomBytes(12);
    return Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
  }
}
