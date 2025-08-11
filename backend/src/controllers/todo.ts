import { findTodos, deleteTodoById, createTodo, updateTodo } from '@/services/todos';
import { ServerApplicationState } from '@hapi/hapi';
import { TodoCreatePayload, TodoUpdatePayload } from '@/schemas/todos';
import { Todo } from '@prisma/client';

export const deleteTodo = async ({
  app,
  existingTodo,
}: {
  app: ServerApplicationState;
  existingTodo: Todo;
}) => {
  const { prisma: prismaClient } = app;

  return deleteTodoById({ prismaClient, todoId: existingTodo.id });
};

export const getTodos = async (app: ServerApplicationState) => {
  const { prisma } = app;

  return findTodos(prisma);
};

export const postTodos = async ({
  app,
  data,
}: {
  app: ServerApplicationState;
  data: TodoCreatePayload;
}) => {
  const { prisma: prismaClient } = app;

  const title = data.title.toString().trim();
  const completed = Boolean(data.completed ?? false);

  return createTodo({ prismaClient, data: { title, completed } });
};

export const putTodos = async ({
  app,
  data,
  existingTodo,
}: {
  app: ServerApplicationState;
  data: TodoUpdatePayload;
  existingTodo: Todo;
}) => {
  const { prisma: prismaClient } = app;

  const title = data.title?.toString().trim();
  const completed = Boolean(data.completed ?? false);

  return updateTodo({ prismaClient, data: { title, completed }, todoId: existingTodo.id });
};
