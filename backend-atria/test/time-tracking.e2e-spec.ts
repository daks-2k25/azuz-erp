import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { ClockRemindersService } from '../src/time-tracking/application/clock-reminders.service';
import { Clock } from '../src/time-tracking/application/ports/clock';
import {
  ClockReminderRepository,
  type ReminderCandidate,
} from '../src/time-tracking/application/ports/clock-reminder.repository';
import { ReminderNotifier } from '../src/time-tracking/application/ports/reminder-notifier';
import { TimeClockEntryRepository } from '../src/time-tracking/application/ports/time-clock-entry.repository';
import { authHeader } from './helpers/bootstrap';
import { E2E_RUN_ID } from './helpers/constants';
import { getE2E } from './helpers/globals';
import { cleanupTimeTrackingData } from './helpers/time-tracking-cleanup';

/** Relógio fixo em um horário de Brasília, para testar os lembretes. */
class FixedClock extends Clock {
  constructor(private readonly instant: Date) {
    super();
  }

  now() {
    return this.instant;
  }
}

/**
 * Usa o repositório real, mas só enxerga os funcionários de teste:
 * o teste nunca pode enviar lembrete para um funcionário real.
 */
class TestUsersOnlyReminderRepository extends ClockReminderRepository {
  constructor(
    private readonly real: ClockReminderRepository,
    private readonly allowedUserIds: string[],
  ) {
    super();
  }

  async listActiveCandidates(): Promise<ReminderCandidate[]> {
    const candidates = await this.real.listActiveCandidates();
    return candidates.filter((candidate) =>
      this.allowedUserIds.includes(candidate.userId),
    );
  }

  tryRecordReminder(
    ...args: Parameters<ClockReminderRepository['tryRecordReminder']>
  ) {
    return this.real.tryRecordReminder(...args);
  }
}

const COMPANY_SCHEDULE = {
  name: `Seg a Qui 08-19 ${E2E_RUN_ID}`,
  days: [1, 2, 3, 4].map((weekday) => ({
    weekday,
    start: '08:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    end: '19:00',
  })),
};

describe('Ponto CLT — fase 1: jornadas e funcionários (e2e)', () => {
  let app: INestApplication;
  let ctx: ReturnType<typeof getE2E>['ctx'];
  let prisma: PrismaService;
  let workScheduleId = '';
  let employeeProfileId = '';

  const server = () => app.getHttpServer();
  const asAdmin = () => authHeader(ctx.admin.token);
  const testUserIds = () => [
    ctx.admin.id,
    ctx.designer.id,
    ctx.designerMaster.id,
    ctx.clientUser.id,
  ];

  beforeAll(async () => {
    ({ app, ctx } = getE2E());
    prisma = app.get(PrismaService);
    await cleanupTimeTrackingData(prisma, testUserIds(), E2E_RUN_ID);
  });

  afterAll(async () => {
    await cleanupTimeTrackingData(prisma, testUserIds(), E2E_RUN_ID);
  });

  describe('autorização', () => {
    it.each(['/time-tracking/work-schedules', '/time-tracking/employees'])(
      '%s — recusa requisição sem token (401)',
      async (route) => {
        await request(server()).get(route).expect(401);
      },
    );

    it.each(['/time-tracking/work-schedules', '/time-tracking/employees'])(
      '%s — recusa usuário sem permissão de gestor (403)',
      async (route) => {
        await request(server())
          .get(route)
          .set(authHeader(ctx.designer.token))
          .expect(403);
      },
    );
  });

  describe('jornadas', () => {
    it('cria a jornada seg–qui 08:00–19:00 com almoço 13:00–14:00', async () => {
      const res = await request(server())
        .post('/time-tracking/work-schedules')
        .set(asAdmin())
        .send(COMPANY_SCHEDULE)
        .expect(201);

      workScheduleId = res.body.id;
      expect(res.body).toMatchObject({
        name: COMPANY_SCHEDULE.name,
        reminderToleranceMinutes: 15,
        isActive: true,
        weeklyWorkMinutes: 40 * 60,
      });
      expect(res.body.days).toHaveLength(4);
      expect(res.body.days[0]).toEqual({
        weekday: 1,
        weekdayLabel: 'Segunda-feira',
        start: '08:00',
        breakStart: '13:00',
        breakEnd: '14:00',
        end: '19:00',
        workMinutes: 10 * 60,
      });
    });

    it('lista a jornada criada', async () => {
      const res = await request(server())
        .get('/time-tracking/work-schedules')
        .set(asAdmin())
        .expect(200);

      const ids = (res.body as Array<{ id: string }>).map((item) => item.id);
      expect(ids).toContain(workScheduleId);
    });

    it('recusa nome repetido (409)', async () => {
      await request(server())
        .post('/time-tracking/work-schedules')
        .set(asAdmin())
        .send(COMPANY_SCHEDULE)
        .expect(409);
    });

    it('recusa horário fora do formato HH:mm (400)', async () => {
      await request(server())
        .post('/time-tracking/work-schedules')
        .set(asAdmin())
        .send({
          name: `Formato inválido ${E2E_RUN_ID}`,
          days: [{ ...COMPANY_SCHEDULE.days[0], start: '8h' }],
        })
        .expect(400);
    });

    it('recusa horários fora de ordem (400)', async () => {
      const res = await request(server())
        .post('/time-tracking/work-schedules')
        .set(asAdmin())
        .send({
          name: `Fora de ordem ${E2E_RUN_ID}`,
          days: [{ ...COMPANY_SCHEDULE.days[0], breakStart: '07:00' }],
        })
        .expect(400);

      expect(JSON.stringify(res.body)).toContain(
        'os horários devem seguir a ordem',
      );
    });

    it('edita a tolerância do lembrete sem perder os dias', async () => {
      const res = await request(server())
        .patch(`/time-tracking/work-schedules/${workScheduleId}`)
        .set(asAdmin())
        .send({ reminderToleranceMinutes: 20 })
        .expect(200);

      expect(res.body.reminderToleranceMinutes).toBe(20);
      expect(res.body.days).toHaveLength(4);
    });
  });

  describe('funcionários CLT', () => {
    it('cadastra o designer como CLT', async () => {
      const res = await request(server())
        .post('/time-tracking/employees')
        .set(asAdmin())
        .send({
          userId: ctx.designer.id,
          admissionDate: '2026-01-15',
          workScheduleId,
        })
        .expect(201);

      employeeProfileId = res.body.id;
      expect(res.body).toMatchObject({
        userId: ctx.designer.id,
        employmentType: 'CLT',
        admissionDate: '2026-01-15',
        workSchedule: { id: workScheduleId, name: COMPANY_SCHEDULE.name },
        isActive: true,
      });
    });

    it('recusa cadastrar o mesmo usuário duas vezes (409)', async () => {
      await request(server())
        .post('/time-tracking/employees')
        .set(asAdmin())
        .send({
          userId: ctx.designer.id,
          admissionDate: '2026-01-15',
          workScheduleId,
        })
        .expect(409);
    });

    it('recusa cadastrar usuário do portal do cliente (400)', async () => {
      await request(server())
        .post('/time-tracking/employees')
        .set(asAdmin())
        .send({
          userId: ctx.clientUser.id,
          admissionDate: '2026-01-15',
          workScheduleId,
        })
        .expect(400);
    });

    it('recusa data de admissão em formato inválido (400)', async () => {
      await request(server())
        .post('/time-tracking/employees')
        .set(asAdmin())
        .send({
          userId: ctx.designerMaster.id,
          admissionDate: '15/01/2026',
          workScheduleId,
        })
        .expect(400);
    });

    it('o funcionário CLT enxerga o próprio cadastro', async () => {
      const res = await request(server())
        .get('/time-tracking/me/profile')
        .set(authHeader(ctx.designer.token))
        .expect(200);

      expect(res.body.profile).toMatchObject({
        id: employeeProfileId,
        isActive: true,
      });
    });

    it('quem não é CLT recebe profile = null', async () => {
      const res = await request(server())
        .get('/time-tracking/me/profile')
        .set(authHeader(ctx.designerMaster.token))
        .expect(200);

      expect(res.body.profile).toBeNull();
    });
  });

  describe('bater ponto', () => {
    it('quem não é CLT não pode bater ponto (403)', async () => {
      await request(server())
        .post('/time-tracking/me/clock')
        .set(authHeader(ctx.designerMaster.token))
        .expect(403);
    });

    it('antes da primeira marcação, a próxima é a entrada', async () => {
      const res = await request(server())
        .get('/time-tracking/me/clock/today')
        .set(authHeader(ctx.designer.token))
        .expect(200);

      expect(res.body.entries).toEqual([]);
      expect(res.body.nextEntry).toEqual({
        entryType: 'CLOCK_IN',
        label: 'Entrada',
      });
      expect(res.body.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('registra a entrada com horário do servidor e NSR de 9 dígitos', async () => {
      const before = Date.now();
      const res = await request(server())
        .post('/time-tracking/me/clock')
        .set(authHeader(ctx.designer.token))
        .expect(201);

      expect(res.body.entry).toMatchObject({
        entryType: 'CLOCK_IN',
        label: 'Entrada',
        origin: 'EMPLOYEE',
      });
      expect(res.body.entry.sequenceNumber).toMatch(/^\d{9}$/);
      expect(res.body.entry.time).toMatch(/^\d{2}:\d{2}$/);
      expect(Date.parse(res.body.entry.recordedAt)).toBeGreaterThanOrEqual(
        before - 1000,
      );
      expect(res.body.today.nextEntry.entryType).toBe('BREAK_START');
    });

    it('recusa clique duplo logo em seguida (409)', async () => {
      await request(server())
        .post('/time-tracking/me/clock')
        .set(authHeader(ctx.designer.token))
        .expect(409);
    });

    it('cliques simultâneos geram apenas uma marcação', async () => {
      await request(server())
        .post('/time-tracking/employees')
        .set(asAdmin())
        .send({
          userId: ctx.designerMaster.id,
          admissionDate: '2026-02-01',
          workScheduleId,
        })
        .expect(201);

      const results = await Promise.all(
        [1, 2, 3].map(() =>
          request(server())
            .post('/time-tracking/me/clock')
            .set(authHeader(ctx.designerMaster.token)),
        ),
      );

      const statuses = results.map((res) => res.status).sort();
      expect(statuses).toEqual([201, 409, 409]);

      const today = await request(server())
        .get('/time-tracking/me/clock/today')
        .set(authHeader(ctx.designerMaster.token))
        .expect(200);
      expect(today.body.entries).toHaveLength(1);
    });

    it('números sequenciais (NSR) não se repetem na empresa', async () => {
      const entries = await prisma.timeClockEntry.findMany({
        where: {
          employeeProfile: {
            userId: { in: [ctx.designer.id, ctx.designerMaster.id] },
          },
        },
        select: { sequenceNumber: true },
      });
      const numbers = entries.map((entry) => entry.sequenceNumber.toString());

      expect(entries).toHaveLength(2);
      expect(new Set(numbers).size).toBe(numbers.length);
    });
  });

  describe('lembretes', () => {
    /** Segunda-feira futura, sem marcações dos funcionários de teste. */
    const MONDAY_08_20 = new Date('2026-10-05T08:20:00.000-03:00');
    const MONDAY_08_10 = new Date('2026-10-05T08:10:00.000-03:00');

    function remindersAt(instant: Date) {
      return new ClockRemindersService(
        new TestUsersOnlyReminderRepository(app.get(ClockReminderRepository), [
          ctx.designer.id,
          ctx.designerMaster.id,
        ]),
        app.get(TimeClockEntryRepository),
        app.get(ReminderNotifier),
        new FixedClock(instant),
      );
    }

    async function reminderNotificationsOf(token: string) {
      const res = await request(server())
        .get('/notifications')
        .set(authHeader(token))
        .expect(200);
      return (res.body as Array<{ type: string; message: string }>).filter(
        (notification) => notification.type === 'time_clock_reminder',
      );
    }

    it('antes de 08:15 não envia lembrete', async () => {
      expect(await remindersAt(MONDAY_08_10).dispatchDueReminders()).toBe(0);
    });

    it('às 08:20 avisa os dois funcionários sem entrada', async () => {
      expect(await remindersAt(MONDAY_08_20).dispatchDueReminders()).toBe(2);

      const notifications = await reminderNotificationsOf(ctx.designer.token);
      expect(notifications).toHaveLength(1);
      expect(notifications[0].message).toBe(
        'Você ainda não registrou a entrada de hoje (prevista para 08:00). Registre na aba Ponto.',
      );
    });

    it('rodar de novo não duplica o lembrete', async () => {
      expect(await remindersAt(MONDAY_08_20).dispatchDueReminders()).toBe(0);
      expect(await reminderNotificationsOf(ctx.designer.token)).toHaveLength(1);
    });

    it('quem não é CLT não recebe lembrete', async () => {
      expect(await reminderNotificationsOf(ctx.admin.token)).toHaveLength(0);
    });
  });

  describe('desativação', () => {
    it('não desativa jornada em uso por funcionário ativo (409)', async () => {
      await request(server())
        .patch(`/time-tracking/work-schedules/${workScheduleId}/deactivate`)
        .set(asAdmin())
        .expect(409);
    });

    it('desativado, o funcionário não consegue bater ponto (403)', async () => {
      await request(server())
        .patch(`/time-tracking/employees/${employeeProfileId}/deactivate`)
        .set(asAdmin())
        .expect(200);

      await request(server())
        .post('/time-tracking/me/clock')
        .set(authHeader(ctx.designer.token))
        .expect(403);
    });

    it('com todos os funcionários desativados, a jornada pode ser desativada', async () => {
      const employees = await request(server())
        .get('/time-tracking/employees')
        .set(asAdmin())
        .expect(200);
      // Só os funcionários de teste: nunca mexer em cadastros reais da empresa.
      const testUserIds = [ctx.designer.id, ctx.designerMaster.id];
      const activeIds = (
        employees.body as Array<{
          id: string;
          userId: string;
          isActive: boolean;
        }>
      )
        .filter(
          (employee) =>
            employee.isActive && testUserIds.includes(employee.userId),
        )
        .map((employee) => employee.id);

      for (const id of activeIds) {
        await request(server())
          .patch(`/time-tracking/employees/${id}/deactivate`)
          .set(asAdmin())
          .expect(200);
      }

      const schedule = await request(server())
        .patch(`/time-tracking/work-schedules/${workScheduleId}/deactivate`)
        .set(asAdmin())
        .expect(200);
      expect(schedule.body.isActive).toBe(false);
    });

    it('não reativa funcionário enquanto a jornada dele estiver inativa (400)', async () => {
      await request(server())
        .patch(`/time-tracking/employees/${employeeProfileId}/activate`)
        .set(asAdmin())
        .expect(400);
    });

    it('reativa a jornada e o funcionário', async () => {
      await request(server())
        .patch(`/time-tracking/work-schedules/${workScheduleId}/activate`)
        .set(asAdmin())
        .expect(200);

      const res = await request(server())
        .patch(`/time-tracking/employees/${employeeProfileId}/activate`)
        .set(asAdmin())
        .expect(200);
      expect(res.body.isActive).toBe(true);
    });
  });

  describe('imutabilidade das marcações (trigger do banco)', () => {
    it('permite inserir, mas bloqueia alterar uma marcação', async () => {
      const entry = await prisma.timeClockEntry.create({
        data: {
          companyId: (
            await prisma.employeeProfile.findUniqueOrThrow({
              where: { id: employeeProfileId },
            })
          ).companyId,
          employeeProfileId,
          sequenceNumber: BigInt(Date.now()),
          entryType: 'CLOCK_IN',
          workDate: new Date('2026-09-24T00:00:00.000Z'),
          recordedAt: new Date(),
        },
      });

      await expect(
        prisma.timeClockEntry.update({
          where: { id: entry.id },
          data: { recordedAt: new Date('2026-09-24T11:00:00.000Z') },
        }),
      ).rejects.toThrow('Marcações de ponto não podem ser alteradas');
    });
  });
});
