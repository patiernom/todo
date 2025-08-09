import { findTodos } from '@/services/todos';

export const getTodos = async (prismaClient: primsmaClient) => findTodos(prismaClient);

export const postTodos = async (prismaClient: primsmaClient) => findTodos(prismaClient);
