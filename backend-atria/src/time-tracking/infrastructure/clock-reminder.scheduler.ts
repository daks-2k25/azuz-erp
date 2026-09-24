import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClockRemindersService } from '../application/clock-reminders.service';
import { COMPANY_TIME_ZONE } from '../domain/work-date';

/**
 * Verifica a cada 5 minutos quem esqueceu de bater o ponto. Os dias e horários
 * vêm da jornada de cada funcionário, então o agendamento roda todos os dias.
 */
@Injectable()
export class ClockReminderScheduler {
  private readonly logger = new Logger(ClockReminderScheduler.name);
  private isRunning = false;

  constructor(private readonly clockReminders: ClockRemindersService) {}

  @Cron('*/5 * * * *', {
    name: 'time-clock-reminders',
    timeZone: COMPANY_TIME_ZONE,
  })
  async handleCron(): Promise<void> {
    // Evita duas execuções sobrepostas se uma demorar mais que o intervalo.
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      const sentCount = await this.clockReminders.dispatchDueReminders();
      if (sentCount > 0) {
        this.logger.log(`${sentCount} lembrete(s) de ponto enviado(s)`);
      }
    } catch (error) {
      this.logger.error(
        'Falha ao enviar lembretes de ponto',
        error instanceof Error ? error.stack : String(error),
      );
    } finally {
      this.isRunning = false;
    }
  }
}
