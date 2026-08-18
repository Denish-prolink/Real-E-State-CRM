import { z } from 'zod';
import { Types } from 'mongoose';

const objectId = (val: unknown) => typeof val === 'string' && Types.ObjectId.isValid(val);

export const createTowerSchema = z.object({
  projectId: z.string().refine(objectId),
  name: z.string().min(1),
  floors: z.number().int().nonnegative().optional(),
  description: z.string().max(1000).optional(),
});

export const updateTowerSchema = createTowerSchema.partial();
