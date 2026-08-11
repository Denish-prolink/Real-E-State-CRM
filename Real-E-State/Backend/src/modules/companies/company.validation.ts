import { z } from 'zod';

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
const PHONE_REGEX = /^\d{10}$/;

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50)
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  gst: z.string().regex(GST_REGEX, 'Invalid GST format').optional().or(z.literal('')),
  sences: z.string().optional().or(z.literal('')),
  pan: z.string().regex(PAN_REGEX, 'Invalid PAN format').optional().or(z.literal('')),
  members: z.number().int().min(0).max(100000).optional().default(0),
  addressLine1: z.string().min(1, 'Address Line 1 is required').max(500),
  addressLine2: z.string().max(500).optional().or(z.literal('')),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  country: z.string().min(1, 'Country is required').max(100),
  pincode: z.string().min(1, 'Pincode is required').max(20),
  contactNumber: z.string().regex(PHONE_REGEX, 'Must be a valid 10-digit phone number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  logo: z.string().optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

export const updateCompanySchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed')
    .optional(),
  gst: z.string().regex(GST_REGEX, 'Invalid GST format').optional().or(z.literal('')),
  sences: z.string().optional().or(z.literal('')),
  pan: z.string().regex(PAN_REGEX, 'Invalid PAN format').optional().or(z.literal('')),
  members: z.number().int().min(0).max(100000).optional(),
  addressLine1: z.string().min(1).max(500).optional(),
  addressLine2: z.string().max(500).optional().or(z.literal('')),
  city: z.string().min(1).max(100).optional(),
  state: z.string().min(1).max(100).optional(),
  country: z.string().min(1).max(100).optional(),
  pincode: z.string().min(1).max(20).optional(),
  contactNumber: z.string().regex(PHONE_REGEX, 'Must be a valid 10-digit phone number').optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  logo: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
});
