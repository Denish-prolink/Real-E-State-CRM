import jwt from 'jsonwebtoken';

import { env } from '../../config/env';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.accessTokenExpiresIn,
  });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenExpiresIn,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
};
