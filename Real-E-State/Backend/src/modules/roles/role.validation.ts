import { z } from 'zod';
import { Types } from 'mongoose';

const objectId = (val: unknown) => typeof val === 'string' && Types.ObjectId.isValid(val);

export const createRoleSchema = z.object({
  name: z.string().min(2),
  description: z.string().max(500).optional(),
  permissions: z.array(z.string().refine(objectId)).optional(),
});

export const updateRoleSchema = createRoleSchema.partial();
