import { Server } from '@hapi/hapi';
import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import dotenv from 'dotenv';

// Load test environment (ensure it points to your test DB)
dotenv.config();

// @ts-ignore
import { init } from '../src/server';

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;

describe('Integration: GET /health', () => {
  let server: Server;

  beforeEach(async () => {
    // No stubs here — this uses the real Prisma instance from the server
    // @ts-ignore
    server = await init();
  });

  afterEach(async () => {
    await server.stop({ timeout: 5_000 });
  });

  it('responds with 200 when DB is reachable', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/health',
    });
    expect(res.statusCode).to.equal(200);
  });
});
