import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { getTodoByIdSchema, TodoUpdatePayload, updateTodoPayloadSchema } from '@/schemas/todos';
import { validationFailAction } from '@/utils/error';
import { findTodo } from '@/preHandlers/todos';
import { putTodos } from '@/controllers/todo';

const putTodosRoute: ServerRoute = {
  method: 'PUT',
  path: '/todos/{id}',
  options: {
    validate: {
      params: getTodoByIdSchema,
      payload: updateTodoPayloadSchema,
      failAction: validationFailAction,
    },
    pre: [{ method: findTodo, assign: 'existingTodo' }],
  },
  handler: async (request: Request, h: ResponseToolkit) => {
    try {
      const {
        server: { app },
        pre: { existingTodo },
        payload,
      } = request;

      // the payload is already validated by Joi and contains only allowed fields
      const data = payload as TodoUpdatePayload;

      const updated = await putTodos({ app, data, existingTodo });

      return h.response(updated).code(200);
    } catch (err) {
      console.error('PUT /todos/{id} error:', err);
      return h.response({ error: 'Failed to update todo' }).code(500);
    }
  },
};

export default putTodosRoute;
