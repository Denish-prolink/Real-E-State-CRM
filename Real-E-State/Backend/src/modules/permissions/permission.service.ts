import { ApiError } from '../../common/exceptions/ApiError';

import * as repository from './permission.repository';
import type { IPermission } from './permission.types';

export const createPermission = async (data: Partial<IPermission>) => {
  return await repository.createPermission(data as IPermission);
};

export const getPermissions = async (search?: string) => {
  return await repository.getPermissions(search);
};

export const getPermissionById = async (id: string) => {
  const p = await repository.getPermissionById(id);
  if (!p) throw new ApiError('Permission not found', 404);
  return p;
};

export const updatePermission = async (id: string, data: Partial<IPermission>) => {
  const p = await repository.updatePermission(id, data);
  if (!p) throw new ApiError('Permission not found', 404);
  return p;
};

export const deletePermission = async (id: string) => {
  const p = await repository.deletePermission(id);
  if (!p) throw new ApiError('Permission not found', 404);
  return p;
};
