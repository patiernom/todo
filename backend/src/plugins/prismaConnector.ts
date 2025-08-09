import { PrismaClient } from '@prisma/client';
import { Server } from '@hapi/hapi';

declare module '@hapi/hapi' {
  interface ServerApplicationState {
    prisma: PrismaClient;
  }
}

const prismaPlugin = {
  name: 'prisma',
  register: async function (server: Server) {
    server.app.prisma = new PrismaClient();

    server.ext({
      type: 'onPreStop',
      method: async (server) => {
        await server.app.prisma
          .$disconnect()
          .catch((e) => console.error('Prisma disconnect error:', e));
      },
    });
  },
};

export default prismaPlugin;
