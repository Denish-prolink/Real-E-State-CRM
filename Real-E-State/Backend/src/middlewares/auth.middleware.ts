import type { NextFunction, Request, Response } from 'express';

import { ApiError } from '../common/exceptions/ApiError';
import { verifyAccessToken } from '../common/helpers/token.helper';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const getAgencyId = (req: AuthenticatedRequest): string => {
  if (req.user?.role === 'AGENCY' && req.user?.userId) {
    return req.user.userId;
  }
  if (['AGENT', 'STAFF'].includes(req.user?.role || '') && req.user?.agencyId) {
    return req.user.agencyId;
  }
  if (req.user?.role === 'SUPER_ADMIN') {
    if (req.method === 'GET') {
      return { $exists: true } as unknown as string;
    }
    throw new ApiError('Forbidden: SUPER_ADMIN cannot perform this write operation without an agency context', 403);
  }
  // For SUPER_ADMIN or if missing
  throw new ApiError('Forbidden: Agency ID required', 403);
};

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid Token',
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to perform this action',
      });
    }
    next();
  };
};
