import Joi from 'joi';

export type TodoUpdatePayload = { title?: string; completed?: boolean };

export const getTodoByIdSchema = Joi.object({
  id: Joi.number().positive().description('The positive integer represents the id of the Todo'),
});

export const createTodoPayloadSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).required().description('Todo title'),
  completed: Joi.boolean().default(false).description('Completion flag'),
})
  .required()
  .unknown(false);

export const updateTodoPayloadSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).description('Todo title'),
  completed: Joi.boolean().description('Completion flag'),
})
  .min(1) // at least one field must be provided
  .required()
  .unknown(false);
