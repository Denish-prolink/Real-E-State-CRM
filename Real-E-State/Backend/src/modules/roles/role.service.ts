import { ApiError } from '../../common/exceptions/ApiError';
import type { IRole } from './role.types';
import * as repository from './role.repository';

export const createRole = async (data: Partial<IRole>) => {
  return await repository.createRole(data);
};

export const getRoles = async (companyId?: string, search?: string) => {
  return await repository.getRoles(companyId, search);
};

export const getRoleById = async (id: string) => {
  const r = await repository.getRoleById(id);
  if (!r) throw new ApiError('Role not found', 404);
  return r;
};

export const updateRole = async (id: string, data: Partial<IRole>) => {
  const r = await repository.updateRole(id, data);
  if (!r) throw new ApiError('Role not found', 404);
  return r;
};

export const deleteRole = async (id: string) => {
  const r = await repository.deleteRole(id);
  if (!r) throw new ApiError('Role not found', 404);
  return r;
};
