import type { Response, Request } from 'express';
import { successResponse } from '../../common/helpers/response.helper';
import * as service from './permission.service';

export const createPermission = async (req: Request, res: Response) => {
  const perm = await service.createPermission(req.body);
  return successResponse(res, 'Permission created', perm, 201);
};

export const getPermissions = async (_req: Request, res: Response) => {
  const perms = await service.getPermissions();
  return successResponse(res, 'Permissions retrieved', perms);
};

export const getPermissionById = async (req: Request, res: Response) => {
  const perm = await service.getPermissionById(req.params.id as string);
  return successResponse(res, 'Permission retrieved', perm);
};

export const updatePermission = async (req: Request, res: Response) => {
  const perm = await service.updatePermission(req.params.id as string, req.body);
  return successResponse(res, 'Permission updated', perm);
};

export const deletePermission = async (req: Request, res: Response) => {
  await service.deletePermission(req.params.id as string);
  return successResponse(res, 'Permission deleted');
};
