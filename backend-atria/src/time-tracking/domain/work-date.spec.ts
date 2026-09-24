import { calendarDateToWorkDate, toLocalDateTime } from './work-date';

describe('work-date (fuso America/Sao_Paulo)', () => {
  it('converte um instante UTC para data e horário de Brasília', () => {
    // 11:02 UTC = 08:02 em Brasília, quinta-feira
    expect(toLocalDateTime(new Date('2026-09-24T11:02:00.000Z'))).toEqual({
      calendarDate: '2026-09-24',
      isoWeekday: 4,
      minutesOfDay: 8 * 60 + 2,
    });
  });

  it('antes das 03:00 UTC ainda é o dia anterior em Brasília', () => {
    // 02:30 UTC de sexta = 23:30 de quinta em Brasília
    expect(toLocalDateTime(new Date('2026-09-25T02:30:00.000Z'))).toEqual({
      calendarDate: '2026-09-24',
      isoWeekday: 4,
      minutesOfDay: 23 * 60 + 30,
    });
  });

  it('domingo é o dia 7', () => {
    expect(
      toLocalDateTime(new Date('2026-09-27T15:00:00.000Z')).isoWeekday,
    ).toBe(7);
  });

  it('meia-noite local é 0 minutos', () => {
    expect(
      toLocalDateTime(new Date('2026-09-24T03:00:00.000Z')).minutesOfDay,
    ).toBe(0);
  });

  it('gera a data da coluna DATE à meia-noite UTC', () => {
    expect(calendarDateToWorkDate('2026-09-24').toISOString()).toBe(
      '2026-09-24T00:00:00.000Z',
    );
  });
});
