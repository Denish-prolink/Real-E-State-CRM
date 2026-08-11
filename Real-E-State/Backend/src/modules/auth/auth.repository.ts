import { User } from './auth.model';
import { RefreshToken } from './refresh-token.model';

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email }).populate('companyId');
};

export const findUserById = async (userId: string) => {
  return User.findById(userId).populate('companyId');
};

export const createUser = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'super_admin' | 'company';
}) => {
  return User.create(payload);
};

export const createRefreshToken = async (userId: string, token: string, expiresAt: Date) => {
  return RefreshToken.create({
    userId,
    token,
    expiresAt,
  });
};

export const findRefreshToken = async (token: string) => {
  return RefreshToken.findOne({
    token,
  });
};

export const deleteRefreshToken = async (token: string) => {
  return RefreshToken.deleteOne({
    token,
  });
};

export const findUserByResetToken = async (token: string) => {
  return User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
};
