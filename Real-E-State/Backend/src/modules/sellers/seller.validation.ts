import { Types } from 'mongoose';
import { z } from 'zod';

const objectId = (val: unknown) => {
  return typeof val === 'string' && Types.ObjectId.isValid(val);
};

export const createSellerSchema = z.object({
  contactId: z.string().refine(objectId, { message: 'Invalid contactId' }).optional(),
  leadId: z.string().refine(objectId, { message: 'Invalid leadId' }).optional(),
  notes: z.string().max(1000).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const updateSellerSchema = z.object({
  contactId: z.string().refine(objectId, { message: 'Invalid contactId' }).optional(),
  leadId: z.string().refine(objectId, { message: 'Invalid leadId' }).optional(),
  notes: z.string().max(1000).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});
