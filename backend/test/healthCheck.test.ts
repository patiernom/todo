import { Server } from '@hapi/hapi';
import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { attachPrismaNoOps } from './utils/prismaTestUtils';
const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());

// @ts-ignore
import { init } from '../src/server';

describe('HEALTH CHECK', () => {
  let server: Server;

  beforeEach(async () => {
    // @ts-ignore
    server = await init();

    // Ensure prisma has no-op methods for this suite
    attachPrismaNoOps(server.app);
  });

  afterEach(async () => {
    await server.stop();
  });

  it('responds with 200 (GET /health)', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/health',
    });
    expect(res.statusCode).to.equal(200);
  });
});
