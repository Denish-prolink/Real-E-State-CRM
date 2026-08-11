import { z } from 'zod';

export const createWarehouseSchema = z.object({
  warehouseCode: z.string().min(1, 'Warehouse Code is required').max(50),
  warehouseName: z
    .string()
    .min(1, 'Warehouse Name is required')
    .max(50)
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  warehouseType: z.enum(['Regular', 'Distribution Center', 'Cold Storage', 'Retail', 'Other']),
  manager: z.string().min(1, 'Manager is required'),
  addressLine1: z.string().min(1, 'Address Line 1 is required').max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  country: z.string().min(1, 'Country is required').max(100),
  pincode: z.string().min(1, 'Pincode is required').max(20),
  capacity: z.number().min(0, 'Capacity must be at least 0'),
});

export const updateWarehouseSchema = z.object({
  warehouseCode: z.string().min(1).max(50).optional(),
  warehouseName: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed')
    .optional(),
  warehouseType: z
    .enum(['Regular', 'Distribution Center', 'Cold Storage', 'Retail', 'Other'])
    .optional(),
  manager: z.string().min(1).optional(),
  addressLine1: z.string().min(1).max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1).max(100).optional(),
  state: z.string().min(1).max(100).optional(),
  country: z.string().min(1).max(100).optional(),
  pincode: z.string().min(1).max(20).optional(),
  capacity: z.number().min(0).optional(),
});
