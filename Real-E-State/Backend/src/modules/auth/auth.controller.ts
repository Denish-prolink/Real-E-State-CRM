import type { Request, Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import type { AuthenticatedRequest } from '../../middlewares/auth.middleware';

import {
  forgotPassword as forgotPasswordService,
  getProfile,
  loginOrCreateGoogleUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword as resetPasswordService,
} from './auth.service';

export const register = async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  return successResponse(res, 'User registered successfully', user, 201);
};

export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body.email, req.body.password);

  return successResponse(res, 'Login successful', result);
};

export const profile = async (req: AuthenticatedRequest, res: Response) => {
  const user = await getProfile(req.user!.userId);

  return successResponse(res, 'Profile fetched successfully', user);
};

export const refreshToken = async (req: Request, res: Response) => {
  const result = await refreshAccessToken(req.body.refreshToken);

  return successResponse(res, 'Token refreshed', result);
};

export const logout = async (req: Request, res: Response) => {
  await logoutUser(req.body.refreshToken);

  return successResponse(res, 'Logout successful');
};

export const googleLogin = async (req: Request, res: Response) => {
  const result = await loginOrCreateGoogleUser(req.body);

  return successResponse(res, 'Google login successful', result);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const result = await forgotPasswordService(req.body.email);
  return successResponse(res, 'If email exists, a reset token was generated', result);
};

export const resetPassword = async (req: Request, res: Response) => {
  await resetPasswordService(req.body.email, req.body.password);
  return successResponse(res, 'Password successfully reset');
};
