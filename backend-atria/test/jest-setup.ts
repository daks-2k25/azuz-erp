import { bootstrapE2E } from './helpers/bootstrap';

beforeAll(async () => {
  const state = (
    globalThis as typeof globalThis & {
      __E2E__?: Awaited<ReturnType<typeof bootstrapE2E>>;
    }
  ).__E2E__;

  if (!state) {
    (
      globalThis as typeof globalThis & {
        __E2E__?: Awaited<ReturnType<typeof bootstrapE2E>>;
      }
    ).__E2E__ = await bootstrapE2E();
  }
}, 120000);
