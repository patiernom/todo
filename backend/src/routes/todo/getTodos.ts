import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { getTodos } from '@/controllers/todo';

const getTodosRoute: ServerRoute = {
  path: '/todos',
  method: 'GET',
  handler: async (request: Request, h: ResponseToolkit) => {
    try {
      const { prisma } = request.server.app;

      const todos = await getTodos(prisma);

      return h.response({ todos }).type('application/json').code(200);
    } catch (err) {
      console.error('GET /todos error:', err);
      return h.response({ error: 'Failed to fetch todos' }).code(500);
    }
  },
};

export default getTodosRoute;
