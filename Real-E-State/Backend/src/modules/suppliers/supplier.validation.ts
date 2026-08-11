import { z } from 'zod';

export const addSupplierSchema = z.object({
  supplierCode: z
    .string()
    .min(1, 'Supplier code is required')
    .max(20, 'Supplier code cannot exceed 20 characters'),

  supplierName: z
    .string()
    .min(2, 'Supplier name must be at least 2 characters')
    .max(100, 'Supplier name cannot exceed 100 characters')
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),

  contactPerson: z
    .string()
    .min(2, 'Contact person must be at least 2 characters')
    .max(50, 'Contact person cannot exceed 50 characters')
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),

  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),

  email: z.string().email('Invalid email address'),

  gstNumber: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/, 'Invalid GST number'),

  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number'),

  address: z.object({
    addressLine1: z.string().min(5, 'Address Line 1 is required'),

    addressLine2: z.string().optional(),

    city: z.string().min(2, 'City is required'),

    state: z.string().min(2, 'State is required'),

    country: z.string().min(2, 'Country is required'),

    pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit pincode'),
  }),

  supplierType: z.string().min(1, 'Supplier type is required'),

  paymentTerms: z.string().min(1, 'Payment terms are required'),

  creditLimit: z.coerce.number().min(0, 'Credit limit cannot be negative'),

  openingBalance: z.coerce.number().min(0, 'Opening balance cannot be negative'),

  bankDetails: z.object({
    bankName: z
      .string()
      .min(2, 'Bank name is required')
      .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),

    accountNumber: z.string().regex(/^\d{9,18}$/, 'Account number must be between 9 and 18 digits'),

    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
  }),

  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),

  status: z.enum(['active', 'inactive']),
});

export const updateSupplierSchema = addSupplierSchema.partial();
