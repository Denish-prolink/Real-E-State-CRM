import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const googleLoginSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
