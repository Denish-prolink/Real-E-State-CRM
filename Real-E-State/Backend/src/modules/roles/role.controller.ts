import type { Response } from 'express';
import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getCompanyId } from '../../middlewares/auth.middleware';
import * as service from './role.service';

export const createRole = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const payload = { ...req.body, companyId };
  const role = await service.createRole(payload);
  return successResponse(res, 'Role created successfully', role, 201);
};

export const getRoles = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const search = (req.query.search as string) || undefined;
  const roles = await service.getRoles(companyId, search);
  return successResponse(res, 'Roles retrieved successfully', roles);
};

export const getRoleById = async (req: AuthenticatedRequest, res: Response) => {
  const role = await service.getRoleById(req.params.id as string);
  return successResponse(res, 'Role retrieved successfully', role);
};

export const updateRole = async (req: AuthenticatedRequest, res: Response) => {
  const role = await service.updateRole(req.params.id as string, req.body);
  return successResponse(res, 'Role updated successfully', role);
};

export const deleteRole = async (req: AuthenticatedRequest, res: Response) => {
  await service.deleteRole(req.params.id as string);
  return successResponse(res, 'Role deleted successfully');
};
