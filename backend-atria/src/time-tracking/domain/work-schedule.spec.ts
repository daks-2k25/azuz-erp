import {
  assertValidReminderTolerance,
  assertValidWorkScheduleDays,
  expectedWeeklyWorkMinutes,
  expectedWorkMinutes,
  InvalidWorkScheduleError,
  type IsoWeekday,
  type WorkScheduleDay,
} from './work-schedule';

/** Jornada atual da empresa: 08:00–19:00 com almoço 13:00–14:00. */
function companyDay(weekday: IsoWeekday): WorkScheduleDay {
  return {
    weekday,
    startMinutes: 480,
    breakStartMinutes: 780,
    breakEndMinutes: 840,
    endMinutes: 1140,
  };
}

const MONDAY_TO_THURSDAY = ([1, 2, 3, 4] as IsoWeekday[]).map(companyDay);

describe('work-schedule', () => {
  describe('cálculo de horas esperadas', () => {
    it('desconta o almoço: 08:00–19:00 com 1h de intervalo = 10h', () => {
      expect(expectedWorkMinutes(companyDay(1))).toBe(600);
    });

    it('segunda a quinta somam 40h semanais', () => {
      expect(expectedWeeklyWorkMinutes(MONDAY_TO_THURSDAY)).toBe(2400);
    });
  });

  describe('validação dos dias', () => {
    it('aceita a jornada da empresa', () => {
      expect(() =>
        assertValidWorkScheduleDays(MONDAY_TO_THURSDAY),
      ).not.toThrow();
    });

    it('exige pelo menos um dia', () => {
      expect(() => assertValidWorkScheduleDays([])).toThrow(
        InvalidWorkScheduleError,
      );
    });

    it('rejeita o mesmo dia repetido', () => {
      expect(() =>
        assertValidWorkScheduleDays([companyDay(1), companyDay(1)]),
      ).toThrow('Segunda-feira foi informado mais de uma vez.');
    });

    it('rejeita horários fora de ordem', () => {
      const lunchBeforeStart = { ...companyDay(2), breakStartMinutes: 400 };
      expect(() => assertValidWorkScheduleDays([lunchBeforeStart])).toThrow(
        InvalidWorkScheduleError,
      );
    });

    it('rejeita dia da semana inválido', () => {
      const invalidDay = { ...companyDay(1), weekday: 8 as IsoWeekday };
      expect(() => assertValidWorkScheduleDays([invalidDay])).toThrow(
        InvalidWorkScheduleError,
      );
    });
  });

  describe('tolerância do lembrete', () => {
    it('aceita valores entre 0 e 120 minutos', () => {
      expect(() => assertValidReminderTolerance(0)).not.toThrow();
      expect(() => assertValidReminderTolerance(15)).not.toThrow();
      expect(() => assertValidReminderTolerance(120)).not.toThrow();
    });

    it('rejeita valores fora do intervalo', () => {
      expect(() => assertValidReminderTolerance(-1)).toThrow(
        InvalidWorkScheduleError,
      );
      expect(() => assertValidReminderTolerance(121)).toThrow(
        InvalidWorkScheduleError,
      );
    });
  });
});
