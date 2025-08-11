import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

import { getTodos } from '@/controllers/todo';

const getTodosRoute: ServerRoute = {
  path: '/todos',
  method: 'GET',
  handler: async (request: Request, h: ResponseToolkit) => {
    try {
      const { app } = request.server;

      const todos = await getTodos(app);

      return h.response({ todos }).type('application/json').code(200);
    } catch (err) {
      console.error('GET /todos error:', err);
      return h.response({ error: 'Failed to fetch todos' }).code(500);
    }
  },
};

export default getTodosRoute;
