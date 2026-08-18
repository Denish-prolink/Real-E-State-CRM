import { z } from 'zod';
import { Types } from 'mongoose';

const objectId = (val: unknown) => {
  return typeof val === 'string' && Types.ObjectId.isValid(val);
};

export const createBuyerSchema = z.object({
  contactId: z.string().refine(objectId, { message: 'Invalid contactId' }).optional(),
  leadId: z.string().refine(objectId, { message: 'Invalid leadId' }).optional(),
  notes: z.string().max(1000).optional(),
  preferences: z.record(z.string(), z.any()).optional(),
});

export const updateBuyerSchema = z.object({
  contactId: z.string().refine(objectId, { message: 'Invalid contactId' }).optional(),
  leadId: z.string().refine(objectId, { message: 'Invalid leadId' }).optional(),
  notes: z.string().max(1000).optional(),
  preferences: z.record(z.string(), z.any()).optional(),
});
