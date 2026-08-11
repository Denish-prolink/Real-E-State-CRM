import { z } from 'zod';

export const addProductSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  manufacturingDate: z.preprocess((val) => (val === '' ? undefined : val), z.string().or(z.date())),
  expiryDate: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().or(z.date()).optional(),
  ),
  quantity: z.coerce.number().min(0).optional().default(0),
  rawPrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
  category: z.string().min(1),
  subCategory: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Discontinued']),
  images: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (Array.isArray(val) ? val : val ? [val] : [])),
  supplier: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => {
      if (Array.isArray(val)) {
        return val;
      }
      if (typeof val === 'string') {
        return val
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean);
      }
      return [];
    })
    .refine((val) => val.length > 0, { message: 'Supplier is required' }),
});

export const updateProductSchema = addProductSchema.partial();
