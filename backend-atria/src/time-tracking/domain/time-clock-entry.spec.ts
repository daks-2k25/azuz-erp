import { TimeClockEntryType } from '@prisma/client';
import {
  decideNewEntryType,
  InvalidTimeClockEntryError,
  nextEntryType,
  workedMinutes,
} from './time-clock-entry';

const { CLOCK_IN, BREAK_START, BREAK_END, CLOCK_OUT } = TimeClockEntryType;

/** Horário de Brasília (UTC-3) em 24/09/2026. */
function brt(time: string): Date {
  return new Date(`2026-09-24T${time}:00.000-03:00`);
}

function entry(entryType: TimeClockEntryType, time: string) {
  return { entryType, recordedAt: brt(time) };
}

describe('time-clock-entry', () => {
  describe('nextEntryType', () => {
    it('segue a ordem entrada → almoço → volta → saída', () => {
      expect(nextEntryType([])).toBe(CLOCK_IN);
      expect(nextEntryType([entry(CLOCK_IN, '08:00')])).toBe(BREAK_START);
      expect(
        nextEntryType([entry(CLOCK_IN, '08:00'), entry(BREAK_START, '13:00')]),
      ).toBe(BREAK_END);
      expect(
        nextEntryType([
          entry(CLOCK_IN, '08:00'),
          entry(BREAK_START, '13:00'),
          entry(BREAK_END, '14:00'),
        ]),
      ).toBe(CLOCK_OUT);
    });

    it('retorna null com o dia completo', () => {
      expect(
        nextEntryType([
          entry(CLOCK_IN, '08:00'),
          entry(BREAK_START, '13:00'),
          entry(BREAK_END, '14:00'),
          entry(CLOCK_OUT, '19:00'),
        ]),
      ).toBeNull();
    });
  });

  describe('decideNewEntryType', () => {
    it('permite a primeira marcação do dia', () => {
      expect(decideNewEntryType([], brt('08:02'))).toBe(CLOCK_IN);
    });

    it('bloqueia clique duplo (menos de 1 minuto depois)', () => {
      expect(() =>
        decideNewEntryType([entry(CLOCK_IN, '08:00')], brt('08:00')),
      ).toThrow(InvalidTimeClockEntryError);
    });

    it('bloqueia a quinta marcação do dia', () => {
      const fullDay = [
        entry(CLOCK_IN, '08:00'),
        entry(BREAK_START, '13:00'),
        entry(BREAK_END, '14:00'),
        entry(CLOCK_OUT, '19:00'),
      ];
      expect(() => decideNewEntryType(fullDay, brt('19:30'))).toThrow(
        'Você já registrou todas as marcações de hoje.',
      );
    });
  });

  describe('workedMinutes', () => {
    it('conta o período aberto até agora', () => {
      expect(workedMinutes([entry(CLOCK_IN, '08:00')], brt('10:30'))).toBe(150);
    });

    it('não conta o almoço', () => {
      const entries = [
        entry(CLOCK_IN, '08:00'),
        entry(BREAK_START, '13:00'),
        entry(BREAK_END, '14:00'),
      ];
      expect(workedMinutes(entries, brt('15:00'))).toBe(6 * 60);
    });

    it('dia completo 08:00–19:00 com almoço 13:00–14:00 = 10h', () => {
      const entries = [
        entry(CLOCK_IN, '08:00'),
        entry(BREAK_START, '13:00'),
        entry(BREAK_END, '14:00'),
        entry(CLOCK_OUT, '19:00'),
      ];
      expect(workedMinutes(entries, brt('23:00'))).toBe(10 * 60);
    });

    it('sem marcações = 0', () => {
      expect(workedMinutes([], brt('09:00'))).toBe(0);
    });
  });
});
