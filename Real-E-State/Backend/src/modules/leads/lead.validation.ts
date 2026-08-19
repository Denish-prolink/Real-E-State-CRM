import { z } from 'zod';

export const createLeadSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().optional(),
  phone: z.string().min(5),
  email: z.string().email().optional(),
  source: z
    .enum(['Website', 'Referral', 'Social Media', 'Cold Call', 'WhatsApp', 'Other'])
    .optional(),
  status: z
    .enum(['New', 'Contacted', 'Qualified', 'Site Visit', 'Negotiation', 'Converted', 'Lost'])
    .optional(),
  priority: z.enum(['High', 'Medium', 'Low']).optional(),
  budget: z.number().optional(),
  propertyType: z.string().optional(),
  location: z.string().optional(),
  bedrooms: z.number().optional(),
  area: z.number().optional(),
  assignedAgent: z.string().optional(),
  expectedPurchaseDate: z.string().optional(),
  notes: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();
