import crypto from 'crypto';

import { ApiError } from '../../common/exceptions/ApiError';
import { comparePassword, hashPassword } from '../../common/helpers/password.helper';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../common/helpers/token.helper';
import type { ICompany } from '../companies/company.model';
import { Role } from '../roles/role.model';
import { Permission } from '../permissions/permission.model';

export const getUserPermissions = async (roleName: string) => {
  let permissionsMap: Record<string, string> = {};
  if (roleName) {
    const roleDoc = await Role.findOne({ name: roleName }).populate('permissions').lean();
    if (roleDoc && roleDoc.permissions) {
      roleDoc.permissions.forEach((perm: any) => {
        if (perm.module && perm.key) {
          const level = perm.key.split('_').pop() || '';
          permissionsMap[perm.module.toLowerCase()] = level;
        }
      });
    }
  }
  return permissionsMap;
};

import {
  createRefreshToken,
  createUser,
  deleteRefreshToken,
  findRefreshToken,
  findUserByEmail,
  findUserById,
} from './auth.repository';

export const registerUser = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const existingUser = await findUserByEmail(payload.email);

  if (existingUser) {
    throw new ApiError('Email already exists', 409);
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await createUser({
    ...payload,
    password: hashedPassword,
  });

  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    agencyId: undefined,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  await createRefreshToken(
    user._id.toString(),
    refreshToken,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );

  const permissions = await getUserPermissions(user.role);
  return {
    accessToken,
    refreshToken,
    user: { ...user.toJSON(), permissions },
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError('Invalid credentials', 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError('Invalid credentials', 401);
  }

  const company = user.agencyId as unknown as ICompany | null;
  if (user.role === 'agency' && company && company.status === 'inactive') {
    throw new ApiError('Your company account is inactive. Please contact support.', 403);
  }

  const agencyId = user.agencyId
    ? (user.agencyId as unknown as { _id?: { toString(): string } })._id?.toString() ||
    (user.agencyId as unknown as { toString(): string }).toString()
    : undefined;

  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    agencyId,
  };

  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken(payload);

  await createRefreshToken(
    user._id.toString(),
    refreshToken,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );

  const permissions = await getUserPermissions(user.role);
  return {
    accessToken,
    refreshToken,
    user: { ...user.toJSON(), permissions },
  };
};

export const getProfile = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  const permissions = await getUserPermissions(user.role);
  return { ...user.toJSON(), permissions };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const tokenRecord = await findRefreshToken(refreshToken);

  if (!tokenRecord) {
    throw new ApiError('Invalid refresh token', 401);
  }

  const payload = verifyRefreshToken(refreshToken);

  const user = await findUserById(payload.userId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  const company = user.agencyId as unknown as ICompany | null;
  if (user.role === 'agency' && company && company.status === 'inactive') {
    throw new ApiError('Your company account is inactive. Please contact support.', 403);
  }

  const agencyId = user.agencyId
    ? (user.agencyId as unknown as { _id?: { toString(): string } })._id?.toString() ||
    (user.agencyId as unknown as { toString(): string }).toString()
    : undefined;

  const accessToken = generateAccessToken({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    agencyId,
  });

  return {
    accessToken,
  };
};

export const logoutUser = async (refreshToken: string) => {
  await deleteRefreshToken(refreshToken);

  return true;
};

export const loginOrCreateGoogleUser = async (payload: {
  email: string;
  firstName: string;
  lastName: string;
}) => {
  let user = await findUserByEmail(payload.email);

  if (!user) {
    // Register the user with a random password since it's required
    const randomPassword = Math.random().toString(36).substring(2, 15);
    const hashedPassword = await hashPassword(randomPassword);
    user = await createUser({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: hashedPassword,
    });
  }

  const company = user.agencyId as unknown as ICompany | null;
  if (user.role === 'agency' && company && company.status === 'inactive') {
    throw new ApiError('Your company account is inactive. Please contact support.', 403);
  }

  const agencyId = user.agencyId
    ? (user.agencyId as unknown as { _id?: { toString(): string } })._id?.toString() ||
    (user.agencyId as unknown as { toString(): string }).toString()
    : undefined;

  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    agencyId,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  await createRefreshToken(
    user._id.toString(),
    refreshToken,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );

  const permissions = await getUserPermissions(user.role);
  return {
    accessToken,
    refreshToken,
    user: { ...user.toJSON(), permissions },
  };
};

export const forgotPassword = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    // Return success anyway to prevent email enumeration
    return { success: true };
  }

  const resetToken = crypto.randomBytes(20).toString('hex');

  user.resetPasswordToken = resetToken;
  // 1 hour expiry
  user.resetPasswordExpires = new Date(Date.now() + 3600000);

  await user.save();

  // In a real app, send email here. For now, returning token.
  return { resetToken };
};

export const resetPassword = async (email: string, newPassword: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError('User not found with this email', 404);
  }

  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return true;
};
