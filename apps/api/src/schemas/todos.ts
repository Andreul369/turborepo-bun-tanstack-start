import { z } from '@hono/zod-openapi';

export const addTodoSchema = z.object({
  name: z.string().min(1).openapi({
    description: 'The name of the todo item',
    example: 'Buy groceries',
  }),
});
