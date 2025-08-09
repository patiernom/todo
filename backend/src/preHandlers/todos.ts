import { Request } from '@hapi/hapi';
import { notFound } from '@hapi/boom';
import { Todo } from '@prisma/client';

export async function findTodo(request: Request /*, h: ResponseToolkit*/): Promise<Todo> {
  const { server, params } = request;
  const { prisma } = server.app;
  const id = Number(params['id']);

  const existing = await prisma.todo.findUnique({ where: { id } });

  console.log('existing', existing);

  if (!existing) {
    throw notFound('Todo not found');
  }

  return existing;
}
