import { z } from 'zod';

export const createSiteVisitSchema = z.object({
  leadId: z.string().min(1),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  visitDate: z.string().min(1),
  status: z.enum(['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled', 'No Show']).optional(),
  feedback: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
});

export const updateSiteVisitSchema = createSiteVisitSchema.partial();
