import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  fileType: z.string().optional(),
  fileSize: z.number().optional(),
  relatedType: z.string().optional(),
  relatedId: z.string().optional(),
});

export const updateDocumentSchema = createDocumentSchema.partial();
