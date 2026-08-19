import { z } from 'zod';

export const createPropertySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  propertyType: z.enum([
    'Apartment',
    'Villa',
    'House',
    'Plot',
    'Office',
    'Shop',
    'Warehouse',
    'Land',
    'Commercial',
  ]),
  purpose: z.enum(['Sale', 'Rent', 'Lease']),
  price: z.number().positive(),
  area: z.number().positive(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  location: z
    .object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  projectId: z.string().optional(),
  tower: z.string().optional(),
  floor: z.string().optional(),
  unitNumber: z.string().optional(),
  agentId: z.string().optional(),
  status: z.enum(['Available', 'Reserved', 'Blocked', 'Booked', 'Sold']).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();
