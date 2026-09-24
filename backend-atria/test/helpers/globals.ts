import { INestApplication } from '@nestjs/common';
import { E2ETestContext } from './bootstrap';

type E2EGlobal = {
  app: INestApplication;
  ctx: E2ETestContext;
};

export function getE2E(): E2EGlobal {
  const state = (
    globalThis as typeof globalThis & { __E2E__?: E2EGlobal }
  ).__E2E__;

  if (!state) {
    throw new Error('E2E global state missing — is globalSetup configured?');
  }

  return state;
}
