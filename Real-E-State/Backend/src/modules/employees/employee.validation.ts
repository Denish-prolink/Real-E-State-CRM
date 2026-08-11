import { z } from 'zod';

const PHONE_REGEX = /^\d{10}$/;

export const createEmployeeSchema = z.object({
  employeeCode: z.string().min(1, 'Employee Code is required').max(50),
  firstName: z
    .string()
    .min(1, 'First Name is required')
    .max(50)
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  lastName: z
    .string()
    .min(1, 'Last Name is required')
    .max(50)
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  mobileNo: z.string().regex(PHONE_REGEX, 'Must be a valid 10-digit phone number'),
  email: z.string().email('Invalid email address'),
  department: z.string().min(1, 'Department is required').max(100),
  designation: z.string().min(1, 'Designation is required').max(100),
  joiningDate: z.string().or(z.date()),
  gender: z.enum(['male', 'female', 'other']),
  dob: z.string().or(z.date()).optional(),
  address: z.string().max(250).optional(),
});

export const updateEmployeeSchema = z.object({
  employeeCode: z.string().min(1).max(50).optional(),
  firstName: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed')
    .optional(),
  lastName: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed')
    .optional(),
  mobileNo: z.string().regex(PHONE_REGEX, 'Must be a valid 10-digit phone number').optional(),
  email: z.string().email('Invalid email address').optional(),
  department: z.string().min(1).max(100).optional(),
  designation: z.string().min(1).max(100).optional(),
  joiningDate: z.string().or(z.date()).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dob: z.string().or(z.date()).optional(),
  address: z.string().max(250).optional(),
});
