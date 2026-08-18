import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().max(2000).optional(),
  startDate: z.string().optional().or(z.date().optional()),
  endDate: z.string().optional().or(z.date().optional()),
  status: z.enum(['Planned', 'Active', 'Completed', 'On Hold']).optional(),
  address: z.string().max(1000).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
