import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { Server } from '@hapi/hapi';
import { init } from '../src/server';
import { makeBasePrismaStub } from './utils/prismaTestUtils';

export const lab = Lab.script();
const { describe, it, beforeEach, after } = lab;

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

describe('Todos API', () => {
  let server: Server;

  // Simple in-memory Prisma stub
  let seq: number;
  let db: Todo[];

  function makePrismaStub() {
    return {
      ...makeBasePrismaStub(),
      todo: {
        findMany: async ({ orderBy }: { orderBy?: { createdAt: 'asc' | 'desc' } } = {}) => {
          const list = [...db];
          if (orderBy?.createdAt === 'desc') {
            list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          } else if (orderBy?.createdAt === 'asc') {
            list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
          }
          return list;
        },
        findUnique: async ({ where: { id } }: { where: { id: number } }) => {
          return db.find((t) => t.id === id) ?? null;
        },
        create: async ({ data }: { data: { title: string; completed?: boolean } }) => {
          const now = new Date();
          const todo: Todo = {
            id: seq++,
            title: data.title,
            completed: Boolean(data.completed ?? false),
            createdAt: now,
            updatedAt: now,
          };
          db.push(todo);
          return todo;
        },
        update: async ({
          where: { id },
          data,
        }: {
          where: { id: number };
          data: { title?: string; completed?: boolean };
        }) => {
          const idx = db.findIndex((t) => t.id === id);
          if (idx === -1) {
            throw Object.assign(new Error('Not found'), { code: 'P2025' });
          }
          const existing = db[idx];
          const updated: Todo = {
            ...existing,
            title: data.title ?? existing.title,
            completed: typeof data.completed === 'boolean' ? data.completed : existing.completed,
            updatedAt: new Date(),
          };
          db[idx] = updated;
          return updated;
        },
        delete: async ({ where: { id } }: { where: { id: number } }) => {
          const idx = db.findIndex((t) => t.id === id);
          if (idx === -1) {
            throw Object.assign(new Error('Not found'), { code: 'P2025' });
          }
          const [removed] = db.splice(idx, 1);
          return removed;
        },
      },
    };
  }

  beforeEach(async () => {
    server = await init();

    // Reset in-memory store and override prisma on the server
    seq = 1;
    db = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (server.app as any).prisma = makePrismaStub();
  });

  after(async () => {
    await server.stop({ timeout: 5_000 });
  });

  it('rejects invalid POST payloads: title cannot be empty, null, or missing', async () => {
    const cases: Array<{ name: string; payload: unknown }> = [
      { name: 'empty string', payload: { title: '' } },
      { name: 'null title', payload: { title: null as unknown as string } },
      { name: 'missing title', payload: {} },
    ];

    for (const c of cases) {
      const res = await server.inject({
        method: 'POST',
        url: '/todos',
        //@ts-ignore
        payload: c.payload,
      });
      expect(res.statusCode, `case: ${c.name}`).to.equal(400);
    }

    // Control: valid payload passes
    const ok = await server.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: 'Valid' },
    });
    expect(ok.statusCode).to.equal(201);
  });

  it('adds a todo (POST /todos)', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: 'Buy milk' },
    });

    expect(res.statusCode).to.equal(201);
    const body = res.result as Todo;
    expect(body).to.include(['id', 'title', 'completed']);
    expect(body.title).to.equal('Buy milk');
    expect(body.completed).to.equal(false);
  });

  it('lists todos (GET /todos)', async () => {
    // Create multiple todos
    await server.inject({ method: 'POST', url: '/todos', payload: { title: 'One' } });
    await server.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: 'Two', completed: true },
    });

    const res = await server.inject({ method: 'GET', url: '/todos' });
    expect(res.statusCode).to.equal(200);

    const body = res.result as { todos: Todo[] };
    expect(body.todos).to.be.array();
    expect(body.todos.length).to.equal(2);

    const titles = body.todos.map((t) => t.title).sort();
    expect(titles).to.equal(['One', 'Two']);
  });

  it('validates id for PUT /todos/{id}: non-numeric id returns 400', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: '/todos/not-a-number',
      payload: { title: 'Anything' },
    });

    expect(res.statusCode).to.equal(400);
  });

  it('returns 404 when updating a non-existing todo (PUT /todos/{id})', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: '/todos/999999',
      payload: { title: 'Updated' },
    });

    expect(res.statusCode).to.equal(404);
  });

  // it('rejects invalid PUT payloads: title cannot be empty, null, or missing', async () => {
  //   // Create first
  //   const create = await server.inject({
  //     method: 'POST',
  //     url: '/todos',
  //     payload: { title: 'Initial' },
  //   });
  //
  //   const created = create.result as Todo;
  //
  //   const cases: Array<{ name: string; payload: unknown }> = [
  //     { name: 'empty string', payload: { title: '' } },
  //     { name: 'null title', payload: { title: null as unknown as string } },
  //     { name: 'missing title', payload: {} },
  //   ];
  //
  //   console.log(`/todos/${created.id}`);
  //
  //   for (const c of cases) {
  //     const res = await server.inject({
  //       method: 'POST',
  //       url: `/todos/${created.id}`,
  //       //@ts-ignore
  //       payload: c.payload,
  //     });
  //     expect(res.statusCode, `case: ${c.name}`).to.equal(400);
  //   }
  // });

  it('modifies a todo (PUT /todos/{id})', async () => {
    // Create first
    const create = await server.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: 'Initial' },
    });
    const created = create.result as Todo;

    // Update
    const res = await server.inject({
      method: 'PUT',
      url: `/todos/${created.id}`,
      payload: { title: 'Updated', completed: true },
    });

    expect(res.statusCode).to.equal(200);
    const body = res.result as Todo;
    expect(body.id).to.equal(created.id);
    expect(body.title).to.equal('Updated');
    expect(body.completed).to.equal(true);
  });

  it('validates id for DELETE /todos/{id}: non-numeric id returns 400', async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: '/todos/not-a-number',
      payload: { title: 'Anything' },
    });

    expect(res.statusCode).to.equal(400);
  });

  it('returns 404 when updating a non-existing todo (DELETE /todos/{id})', async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: '/todos/999999',
      payload: { title: 'Updated' },
    });

    expect(res.statusCode).to.equal(404);
  });

  it('deletes a todo (DELETE /todos/{id})', async () => {
    // Create first
    const create = await server.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: 'To be removed' },
    });
    const created = create.result as Todo;

    // Delete
    const del = await server.inject({
      method: 'DELETE',
      url: `/todos/${created.id}`,
    });
    expect(del.statusCode).to.equal(204);

    // Verify it's gone via GET /todos
    const get = await server.inject({ method: 'GET', url: '/todos' });
    expect(get.statusCode).to.equal(200);
    const list = (get.result as { todos: Todo[] }).todos ?? [];
    expect(list.find((t) => t.id === created.id)).to.not.exist();
  });
});
