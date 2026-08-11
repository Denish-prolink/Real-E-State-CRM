import { z } from 'zod';

const PHONE_REGEX = /^\d{10}$/;

export const createContactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50)
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  type: z.enum(['customer', 'supplier']),
  email: z.string().email('Invalid email address'),
  mobileNo: z.string().regex(PHONE_REGEX, 'Must be a valid 10-digit phone number'),
  gender: z.enum(['male', 'female', 'other']),
  dob: z.string().optional().or(z.date().optional()),
  address: z.string().max(500).optional(),
  notes: z.string().max(500).optional(),
});

export const updateContactSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed')
    .optional(),
  type: z.enum(['customer', 'supplier']).optional(),
  email: z.string().email('Invalid email address').optional(),
  mobileNo: z.string().regex(PHONE_REGEX, 'Must be a valid 10-digit phone number').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dob: z.string().optional().or(z.date().optional()),
  address: z.string().max(500).optional(),
  notes: z.string().max(500).optional(),
});
