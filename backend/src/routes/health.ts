import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

const healthCheckRoutes: ServerRoute[] = [
  {
    path: '/health',
    method: 'GET',
    handler: async (request: Request, h: ResponseToolkit) => {
      const { prisma } = request.server.app;

      try {
        await prisma.$queryRaw`SELECT 1`;
        return h.response({ status: 'ok' }).code(200);
      } catch (err) {
        console.error('Health check error:', err);
        return h.response({ status: 'error' }).code(500);
      }
    },
  },
];

export default healthCheckRoutes;
