import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AllowAuthenticated } from '../../auth/decorators/allow-authenticated.decorator';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TimeClockService } from '../application/time-clock.service';
import {
  toRegisterEntryResponse,
  toTodayClockResponse,
} from './time-clock.mappers';

/** Limite de tentativas de marcação por minuto, por usuário/IP. */
const TIME_CLOCK_THROTTLE = {
  default: { limit: 10, ttl: 60_000 },
} as const;

/**
 * Ponto do próprio usuário logado. O acesso é decidido pelo cadastro CLT
 * ativo (verificado no TimeClockService), não pelo perfil de acesso.
 */
@Controller('time-tracking/me/clock')
@UseGuards(JwtAuthGuard)
@AllowAuthenticated()
export class MyTimeClockController {
  constructor(private readonly timeClock: TimeClockService) {}

  @Get('today')
  async getToday(@CurrentUser() user: AuthenticatedUser) {
    const today = await this.timeClock.getToday(user.userId);
    return toTodayClockResponse(today);
  }

  @Post()
  @Throttle(TIME_CLOCK_THROTTLE)
  async register(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.timeClock.register(user.userId);
    return toRegisterEntryResponse(result);
  }
}
