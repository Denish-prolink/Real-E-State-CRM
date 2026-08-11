import { z } from 'zod';

export const addSkuSchema = z.object({
  name: z
    .string()
    .min(2)
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  unit: z.enum([
    'ml',
    'DOZEN',
    'BOX',
    'GRAMS',
    'KILOGRAMS',
    'METERS',
    'TABLETS',
    'UNITS',
    'PIECES',
    'PAIRS',
  ]),
  skuCode: z.string().min(1),
  description: z.string().optional(),
});

export const updateSkuSchema = addSkuSchema.partial();
