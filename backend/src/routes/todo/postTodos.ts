import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

import { createTodoPayloadSchema, TodoCreatePayload } from '@/schemas/todos';
import { validationFailAction } from '@/utils/error';
import { postTodos } from '@/controllers/todo';

const getTodosRoute: ServerRoute = {
  method: 'POST',
  path: '/todos',
  options: {
    validate: {
      payload: createTodoPayloadSchema,
      failAction: validationFailAction,
    },
  },
  handler: async (request: Request, h: ResponseToolkit) => {
    try {
      const {
        server: { app },
        payload,
      } = request;

      // the payload is already validated by Joi and contains only allowed fields
      const data = payload as TodoCreatePayload;

      const created = await postTodos({ app, data });

      return h.response(created).code(201);
    } catch (err) {
      console.error('POST /todos error:', err);
      return h.response({ error: 'Failed to create todo' }).code(500);
    }
  },
};

export default getTodosRoute;
