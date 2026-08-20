import { z } from 'zod';

export const createPropertySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  propertyType: z.enum(['Apartment', 'Villa', 'House', 'Plot', 'Office', 'Shop', 'Warehouse', 'Land', 'Commercial']),
  purpose: z.enum(['Sale', 'Rent', 'Lease']),
  price: z.coerce.number().positive(),
  area: z.coerce.number().positive(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  parking: z.coerce.number().optional(),
  location: z.any().transform((val) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return {}; }
    }
    return val;
  }).optional(),
  projectId: z.string().optional(),
  tower: z.string().optional(),
  floor: z.string().optional(),
  unitNumber: z.string().optional(),
  agentId: z.string().optional(),
  status: z.enum(['Available', 'Reserved', 'Blocked', 'Booked', 'Sold']).optional(),
  photos: z.any().transform(val => {
    if (Array.isArray(val)) return val.filter(v => typeof v === 'string');
    if (typeof val === 'string') {
      try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : []; }
      catch { return [val]; }
    }
    return [];
  }).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();
