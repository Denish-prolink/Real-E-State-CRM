import { z } from 'zod';

export const createDealSchema = z.object({
  leadId: z.string().min(1),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  dealValue: z.number().positive(),
  discount: z.number().optional(),
  expectedClosingDate: z.string().optional(),
  stage: z.enum(['New', 'Qualified', 'Site Visit', 'Negotiation', 'Booking', 'Won', 'Lost']).optional(),
  probability: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export const updateDealSchema = createDealSchema.partial();
