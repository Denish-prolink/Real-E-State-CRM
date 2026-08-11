import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import {
  forgotPassword,
  googleLogin,
  login,
  logout,
  profile,
  refreshToken,
  register,
  resetPassword,
} from './auth.controller';
import {
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from './auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

router.post('/google-login', validate(googleLoginSchema), googleLogin);

router.get('/profile', authenticate, profile);

router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);

router.post('/logout', validate(refreshTokenSchema), logout);

router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
