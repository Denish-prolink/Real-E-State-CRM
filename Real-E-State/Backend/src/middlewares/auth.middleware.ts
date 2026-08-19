import type { NextFunction, Request, Response } from 'express';
import { Role } from '../modules/roles/role.model';
import { Permission, type IPermission } from '../modules/permissions/permission.model';

import { ApiError } from '../common/exceptions/ApiError';
import { verifyAccessToken } from '../common/helpers/token.helper';
import type { JwtPayload as CustomJwtPayload } from '../common/interfaces/jwt-payload.interface';

export interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload;
}

export interface RBACRequest extends AuthenticatedRequest {
  rbacScope?: string;
}

export const getAgencyId = (req: AuthenticatedRequest): string | undefined => {
  if (req.user?.role === 'super_admin') return undefined;
  if (req.user?.agencyId) {
    return req.user.agencyId;
  }
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

export const authorizeModule = (moduleName: string, allowedLevels: string[] = []) => {
  return async (req: RBACRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
      const role = await Role.findOne({ name: req.user.role }).populate<{ permissions: IPermission[] }>('permissions');
      if (!role) {
        return res.status(403).json({ success: false, message: 'Forbidden: Role not found' });
      }

      const modKey = moduleName.toLowerCase().replace(/ /g, '_').replace(/&/g, 'and');
      
      const modulePermissions = role.permissions.filter(p => p.module === modKey);
      
      if (modulePermissions.length === 0) {
        return res.status(403).json({ success: false, message: 'Forbidden: No permission for this module' });
      }

      const permKey = modulePermissions[0].key;
      const level = permKey.split(':')[1]; // e.g., 'manage', 'own_agency', 'full'

      if (allowedLevels.length > 0 && !allowedLevels.map(l => l.toLowerCase().replace(/ /g, '_')).includes(level) && level !== 'full') {
        return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permission level' });
      }

      req.rbacScope = level; // 'full', 'manage', 'own', 'own_agency', 'assigned', 'view'
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};
