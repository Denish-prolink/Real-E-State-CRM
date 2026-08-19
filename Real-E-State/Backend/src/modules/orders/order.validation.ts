import { z } from 'zod';

const orderItemSchema = z.object({
  warehouse: z.string().min(1, 'Warehouse is required'),
  product: z.string().min(1, 'Product is required'),
  sku: z.string().optional().default(''),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be at least 0'),
  total: z.number().min(0),
});

export const createOrderSchema = z.object({
  orderType: z.enum(['purchase', 'sell']),
  contact: z.string().min(1, 'Contact is required'),
  items: z
    .array(orderItemSchema)
    .min(1, 'At least one item is required')
    .refine(
      (items) => {
        const seen = new Set<string>();
        for (const item of items) {
          if (item.warehouse && item.product && item.sku) {
            const key = `${item.warehouse}-${item.product}-${item.sku}`;
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
          }
        }
        return true;
      },
      { message: 'Duplicate entries with the same Warehouse, Product, and SKU are not allowed.' },
    ),
  gstAndCharges: z.number().min(0).default(0),
  discountType: z.enum(['percentage', 'amount']).default('amount'),
  discountValue: z.number().min(0).default(0),
  finalPrice: z.number().min(0),
  deliveryAddress: z.string().optional().default(''),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).default('pending'),
});

export const updateOrderSchema = createOrderSchema.partial();
