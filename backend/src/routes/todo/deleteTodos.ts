import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { getTodoByIdSchema } from '@/schemas/todos';
import { validationFailAction } from '@/utils/error';
import { findTodo } from '@/preHandlers/todos';
import { deleteTodo } from '@/controllers/todo';

const deleteTodosRoute: ServerRoute = {
  method: 'DELETE',
  path: '/todos/{id}',
  options: {
    validate: {
      params: getTodoByIdSchema,
      failAction: validationFailAction,
    },
    pre: [{ method: findTodo, assign: 'existingTodo' }],
  },
  handler: async (request: Request, h: ResponseToolkit) => {
    try {
      const {
        server: { app },
        pre: { existingTodo },
      } = request;

      await deleteTodo({
        app,
        existingTodo,
      });

      return h.response().code(204);
    } catch (err) {
      console.error('DELETE /todos/{id} error:', err);
      return h.response({ error: 'Failed to delete todo' }).code(500);
    }
  },
};

export default deleteTodosRoute;
