import { Server } from '@hapi/hapi';
import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import dotenv from 'dotenv';

// Load test environment (ensure it points to your test DB)
dotenv.config();

// @ts-ignore
import { init } from '../src/server';

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

describe('Integration: Todos API', () => {
  let server: Server;

  beforeEach(async () => {
    // @ts-ignore
    server = await init();

    // Clean DB to isolate tests
    await (server.app as any).prisma.todo.deleteMany();
  });

  afterEach(async () => {
    await server.stop({ timeout: 5_000 });
  });

  it('creates a todo (POST /todos) against real DB', async () => {
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

  it('lists todos (GET /todos) against real DB', async () => {
    // Seed a couple of rows via API
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
});
