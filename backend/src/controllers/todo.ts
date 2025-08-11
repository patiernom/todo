import { findTodos } from '@/services/todos';
import { ServerApplicationState } from '@hapi/hapi';

export const getTodos = async (app: ServerApplicationState) => {
  const { prisma } = app;

  return findTodos(prisma);
};

//export const postTodos = async (prismaClient) => findTodos(prismaClient);
