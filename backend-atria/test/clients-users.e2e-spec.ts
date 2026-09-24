import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { authHeader } from './helpers/bootstrap';
import { getE2E } from './helpers/globals';
import { E2E_RUN_ID } from './helpers/constants';

describe('Clients & Users (e2e)', () => {
  let app: INestApplication;
  let ctx: ReturnType<typeof getE2E>['ctx'];
  let createdClientId: string;
  let provisionedUserId: string;

  beforeAll(() => {
    ({ app, ctx } = getE2E());
  });

  it('POST /clients — creates a client', async () => {
    const res = await request(app.getHttpServer())
      .post('/clients')
      .set(authHeader(ctx.admin.token))
      .send({
        companyName: `Provision Target ${E2E_RUN_ID}`,
        contactName: 'QA Contact',
        email: `qa.${E2E_RUN_ID}@client.test`,
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.companyName).toContain(E2E_RUN_ID);
    createdClientId = res.body.id;
  });

  it('POST /users/provision — provisions CLIENT user linked to client', async () => {
    const uniqueEmail = `portal.${Date.now()}@client.test`;

    const res = await request(app.getHttpServer())
      .post('/users/provision')
      .set(authHeader(ctx.admin.token))
      .send({
        name: `Portal User ${E2E_RUN_ID}`,
        role: 'CLIENT',
        clientId: createdClientId,
        email: uniqueEmail,
        password: 'PortalUser!123',
      })
      .expect(201);

    expect(res.body.user.role).toBe('client');
    expect(res.body.user.clientId).toBe(createdClientId);
    provisionedUserId = res.body.user.id;
  });

  it('POST /users/provision — rejects CLIENT without clientId', async () => {
    await request(app.getHttpServer())
      .post('/users/provision')
      .set(authHeader(ctx.admin.token))
      .send({
        name: 'Invalid Client User',
        role: 'CLIENT',
        email: `invalid.${E2E_RUN_ID}@client.test`,
        password: 'PortalUser!123',
      })
      .expect(400);
  });

  it('PATCH /users/:id — updates client link on existing user', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/users/${provisionedUserId}`)
      .set(authHeader(ctx.admin.token))
      .send({ clientId: ctx.client.id, role: 'CLIENT' })
      .expect(200);

    expect(res.body.clientId).toBe(ctx.client.id);
  });
});
