import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

const getTodosRoute: ServerRoute = {
  path: '/todos',
  method: 'GET',
  handler: async (request: Request, h: ResponseToolkit) => {
    try {
      const { prisma } = request.server.app;

      const todos = await prisma.todo.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return h.response({ todos }).type('application/json').code(200);
    } catch (err) {
      console.error('GET /todos error:', err);
      return h.response({ error: 'Failed to fetch todos' }).code(500);
    }
  },
};

export default getTodosRoute;
