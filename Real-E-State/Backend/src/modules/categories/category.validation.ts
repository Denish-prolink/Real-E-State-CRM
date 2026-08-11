import { z } from 'zod';

export const addCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  description: z.string().optional(),
});

export const updateCategorySchema = addCategorySchema.partial();
