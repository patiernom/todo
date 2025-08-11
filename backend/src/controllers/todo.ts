import { findTodos, deleteTodoById } from '@/services/todos';
import { ServerApplicationState } from '@hapi/hapi';

export const getTodos = async (app: ServerApplicationState) => {
  const { prisma } = app;

  return findTodos(prisma);
};

//export const postTodos = async (prismaClient) => findTodos(prismaClient);

export const deleteTodo = async ({
  app,
  todoId,
}: {
  app: ServerApplicationState;
  todoId: number;
}) => {
  const { prisma: prismaClient } = app;

  return deleteTodoById({ prismaClient, todoId });
};
