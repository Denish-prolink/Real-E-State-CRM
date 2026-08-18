import { z } from 'zod';
import { Types } from 'mongoose';

const objectId = (val: unknown) => typeof val === 'string' && Types.ObjectId.isValid(val);

export const createAgentSchema = z.object({
  userId: z.string().refine(objectId).optional(),
  firstName: z.string().min(1),
  lastName: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
  licenseNo: z.string().max(100).optional(),
  active: z.boolean().optional(),
  notes: z.string().max(2000).optional(),
});

export const updateAgentSchema = createAgentSchema.partial();
