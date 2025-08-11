import { PrismaClient } from '@prisma/client';
import { TodoCreatePayload, TodoUpdatePayload } from '@/schemas/todos';

export const findTodos = async function (prismaClient: PrismaClient) {
  return prismaClient.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const createTodo = async function ({
  prismaClient,
  data,
}: {
  prismaClient: PrismaClient;
  data: TodoCreatePayload;
}) {
  return prismaClient.todo.create({
    data,
  });
};

export const deleteTodoById = async function ({
  prismaClient,
  todoId,
}: {
  prismaClient: PrismaClient;
  todoId: number;
}) {
  return prismaClient.todo.delete({ where: { id: todoId } });
};

export const findTodoById = async function ({
  prismaClient,
  todoId,
}: {
  prismaClient: PrismaClient;
  todoId: number;
}) {
  return prismaClient.todo.findUnique({ where: { id: todoId } });
};

export const updateTodo = async function ({
  prismaClient,
  todoId,
  data,
}: {
  prismaClient: PrismaClient;
  todoId: number;
  data: TodoUpdatePayload;
}) {
  return prismaClient.todo.update({
    where: { id: todoId },
    data,
  });
};
