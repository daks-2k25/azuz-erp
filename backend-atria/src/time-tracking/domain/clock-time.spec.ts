import {
  clockTimeToMinutes,
  isValidClockTime,
  minutesToClockTime,
} from './clock-time';

describe('clock-time', () => {
  it('converte HH:mm para minutos desde 00:00', () => {
    expect(clockTimeToMinutes('00:00')).toBe(0);
    expect(clockTimeToMinutes('08:00')).toBe(480);
    expect(clockTimeToMinutes('13:00')).toBe(780);
    expect(clockTimeToMinutes('19:00')).toBe(1140);
    expect(clockTimeToMinutes('23:59')).toBe(1439);
  });

  it('converte minutos para HH:mm', () => {
    expect(minutesToClockTime(0)).toBe('00:00');
    expect(minutesToClockTime(480)).toBe('08:00');
    expect(minutesToClockTime(845)).toBe('14:05');
    expect(minutesToClockTime(1440)).toBe('24:00');
  });

  it('rejeita horários fora do formato', () => {
    expect(isValidClockTime('8:00')).toBe(false);
    expect(isValidClockTime('24:00')).toBe(false);
    expect(isValidClockTime('12:60')).toBe(false);
    expect(() => clockTimeToMinutes('abc')).toThrow();
  });

  it('rejeita minutos fora de um dia', () => {
    expect(() => minutesToClockTime(-1)).toThrow();
    expect(() => minutesToClockTime(1441)).toThrow();
    expect(() => minutesToClockTime(1.5)).toThrow();
  });
});
