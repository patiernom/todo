import { Request, ResponseToolkit } from '@hapi/hapi';
import { badRequest } from '@hapi/boom';

export const validationFailAction = (request: Request, h: ResponseToolkit, err?: unknown) => {
  if (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Validation Error: `, err);

    throw badRequest(`Validation Error: ${message}`);
  }

  return h.continue;
};
