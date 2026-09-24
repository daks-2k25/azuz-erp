import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { authHeader } from './helpers/bootstrap';
import { getE2E } from './helpers/globals';
import { TEST_ADMIN } from './helpers/constants';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let ctx: ReturnType<typeof getE2E>['ctx'];

  beforeAll(() => {
    ({ app, ctx } = getE2E());
  });

  it('POST /auth/login — valid credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(TEST_ADMIN.email);
    expect(res.body.user.role).toBe('ADMIN');
  });

  it('POST /auth/login — wrong password returns 401', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: TEST_ADMIN.email, password: 'wrong-password' })
      .expect(401);
  });

  it('GET /auth/me — returns profile for authenticated user', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set(authHeader(ctx.admin.token))
      .expect(200);

    expect(res.body.email).toBe(TEST_ADMIN.email);
  });

  it('GET /auth/me — rejects missing token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('POST /auth/logout — clears session', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password })
      .expect(200);

    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', login.headers['set-cookie'] ?? [])
      .send({ refreshToken: login.body.refreshToken })
      .expect(204);
  });
});
