import { ServerRoute } from '@hapi/hapi';

import getTodosRoute from './getTodos';
import postTodos from '@/routes/todo/postTodos';
import putTodosRoute from '@/routes/todo/putTodos';
import deleteTodos from '@/routes/todo/deleteTodos';

const todoRoutes: ServerRoute[] = [getTodosRoute, postTodos, putTodosRoute, deleteTodos];

export default todoRoutes;
