import { bootstrapE2E, teardownE2E } from './helpers/bootstrap';

export default async function globalTeardown() {
  await teardownE2E();
}
