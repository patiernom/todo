import { Request } from '@hapi/hapi';
import { notFound } from '@hapi/boom';
import { Todo } from '@prisma/client';
import { findTodoById } from '@/services/todos';

export async function findTodo(request: Request /*, h: ResponseToolkit*/): Promise<Todo> {
  const { server, params } = request;
  const { prisma: prismaClient } = server.app;
  const todoId = Number(params.id);

  const existingTodo = await findTodoById({ prismaClient, todoId });

  if (!existingTodo) {
    throw notFound('Todo not found');
  }

  return existingTodo;
}
