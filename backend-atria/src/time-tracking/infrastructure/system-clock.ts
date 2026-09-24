import { Injectable } from '@nestjs/common';
import { Clock } from '../application/ports/clock';

/** Horário do servidor: o funcionário não consegue alterar pelo navegador. */
@Injectable()
export class SystemClock extends Clock {
  now(): Date {
    return new Date();
  }
}
