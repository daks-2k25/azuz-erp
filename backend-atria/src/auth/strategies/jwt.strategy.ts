import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { resolvePermissions } from '../constants/permissions';
import { AuthenticatedUser } from '../decorators/current-user.decorator';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  category?: 'MEMBER' | 'CLIENT';
  clientId?: string | null;
  companyId?: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        category: true,
        clientId: true,
        companyId: true,
        isActive: true,
        company: { select: { status: true } },
        role: { select: { name: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    if (user.company.status === 'SUSPENDED') {
      throw new UnauthorizedException('Company is suspended');
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role.name,
      category: user.category,
      clientId: user.clientId,
      companyId: user.companyId,
      permissions: resolvePermissions(user.role.name),
      isActive: user.isActive,
    };
  }
}
