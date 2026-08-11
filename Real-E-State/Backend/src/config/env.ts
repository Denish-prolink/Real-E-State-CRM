import dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config();

const requiredEnv = ['PORT', 'MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGO_URI as string,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  accessTokenExpiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN || '15m') as StringValue,
  refreshTokenExpiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') as StringValue,
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
