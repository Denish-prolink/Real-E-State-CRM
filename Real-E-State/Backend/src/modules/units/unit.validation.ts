import { Types } from 'mongoose';
import { z } from 'zod';

const objectId = (val: unknown) => typeof val === 'string' && Types.ObjectId.isValid(val);

export const createUnitSchema = z.object({
  projectId: z.string().refine(objectId).optional(),
  towerId: z.string().refine(objectId).optional(),
  unitNumber: z.string().min(1),
  floor: z.union([z.number(), z.string()]).optional(),
  size: z.number().optional(),
  price: z.number().optional(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  status: z.enum(['Available', 'Reserved', 'Booked', 'Sold']).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const updateUnitSchema = createUnitSchema.partial();
