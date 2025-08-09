import Hapi from '@hapi/hapi';

import { SERVER_PORT, SERVER_HOST } from '@/utils/constants';
import * as routes from '@/routes/index';
import prismaConnector from '@/plugins/prismaConnector';

async function createServer() {
  const server = Hapi.server({
    port: SERVER_PORT,
    host: SERVER_HOST,
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['content-type'],
      },
    },
  });

  // Plugins
  await server.register({
    plugin: prismaConnector,
  });

  // Routes
  Object.values(routes).forEach((route) => {
    server.route(route);
  });

  return server;
}

export const init = async function () {
  const server = await createServer();
  await server.initialize();

  return server;
};

export const start = async function () {
  const server = await createServer();

  try {
    await server.start();
  } catch (err) {
    console.error('Failed to start server:', err);
    await server.app.prisma.$disconnect().catch(() => undefined);
    process.exit(1);
  }

  console.log(`Server running on ${server.info.uri}`);

  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down...`);
    await server.stop({ timeout: 10_000 });
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
};
