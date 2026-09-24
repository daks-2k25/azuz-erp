/** Fonte do horário atual. Abstraída para que os testes controlem o tempo. */
export abstract class Clock {
  abstract now(): Date;
}
