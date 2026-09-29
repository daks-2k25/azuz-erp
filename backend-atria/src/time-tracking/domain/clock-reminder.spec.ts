import { TimeClockEntryType } from '@prisma/client';
import { findDueReminder, reminderNotificationText } from './clock-reminder';
import type { WorkScheduleDay } from './work-schedule';

const { CLOCK_IN, BREAK_START, BREAK_END, CLOCK_OUT } = TimeClockEntryType;

/** 08:00–19:00 com almoço 13:00–14:00 */
const COMPANY_DAY: WorkScheduleDay = {
  weekday: 1,
  startMinutes: 480,
  breakStartMinutes: 780,
  breakEndMinutes: 840,
  endMinutes: 1140,
};
const TOLERANCE = 15;

function at(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function check(time: string, registered: TimeClockEntryType[] = []) {
  return findDueReminder({
    scheduleDay: COMPANY_DAY,
    toleranceMinutes: TOLERANCE,
    entriesOfDay: registered.map((entryType) => ({ entryType })),
    minutesOfDay: at(time),
  });
}

describe('clock-reminder', () => {
  it('não lembra antes de horário previsto + tolerância', () => {
    expect(check('08:14')).toBeNull();
  });

  it('lembra a entrada às 08:15 sem marcação', () => {
    expect(check('08:15')).toEqual({
      entryType: CLOCK_IN,
      expectedMinutes: at('08:00'),
    });
  });

  it('não lembra quem já bateu a entrada', () => {
    expect(check('09:00', [CLOCK_IN])).toBeNull();
  });

  it('lembra a saída para almoço às 13:15', () => {
    expect(check('13:15', [CLOCK_IN])?.entryType).toBe(BREAK_START);
  });

  it('lembra a volta do almoço às 14:15', () => {
    expect(check('14:15', [CLOCK_IN, BREAK_START])?.entryType).toBe(BREAK_END);
  });

  it('lembra a saída às 19:15', () => {
    expect(check('19:15', [CLOCK_IN, BREAK_START, BREAK_END])?.entryType).toBe(
      CLOCK_OUT,
    );
  });

  it('não lembra com o dia completo', () => {
    expect(
      check('20:00', [CLOCK_IN, BREAK_START, BREAK_END, CLOCK_OUT]),
    ).toBeNull();
  });

  it('só lembra a próxima marcação, mesmo com várias atrasadas', () => {
    expect(check('15:00')?.entryType).toBe(CLOCK_IN);
  });

  it('não lembra em dia sem jornada', () => {
    expect(
      findDueReminder({
        scheduleDay: null,
        toleranceMinutes: TOLERANCE,
        entriesOfDay: [],
        minutesOfDay: at('10:00'),
      }),
    ).toBeNull();
  });

  it('monta o texto do lembrete com o horário previsto', () => {
    expect(
      reminderNotificationText({
        entryType: BREAK_END,
        expectedMinutes: at('14:00'),
      }),
    ).toEqual({
      title: 'Lembrete de ponto',
      message:
        'Você ainda não registrou a volta do almoço de hoje (prevista para 14:00). Registre na aba Ponto.',
    });
  });
});
