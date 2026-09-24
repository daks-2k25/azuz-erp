import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { authHeader } from './helpers/bootstrap';
import { getE2E } from './helpers/globals';

describe('SLA API (e2e)', () => {
  let app: INestApplication;
  let ctx: ReturnType<typeof getE2E>['ctx'];

  beforeAll(() => {
    ({ app, ctx } = getE2E());
  });

  it('GET /sla/settings — returns settings without null crashes', async () => {
    const res = await request(app.getHttpServer())
      .get('/sla/settings')
      .set(authHeader(ctx.admin.token))
      .expect(200);

    expect(res.body).toBeDefined();
    expect(typeof res.body.slaResponseMediumHours).toBe('number');
  });

  it('GET /sla/dashboard — computes statuses safely', async () => {
    const res = await request(app.getHttpServer())
      .get('/sla/dashboard')
      .set(authHeader(ctx.admin.token))
      .expect(200);

    expect(res.body).toBeDefined();
  });
});
