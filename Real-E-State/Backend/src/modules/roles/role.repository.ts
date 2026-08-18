import { Role } from './role.model';
import type { IRole } from './role.types';

export const createRole = async (data: Partial<IRole>) => {
  const r = new Role(data);
  return await r.save();
};

const buildFilter = (companyId?: string, search?: string) => {
  const base: any = {};
  if (companyId) base.companyId = companyId;
  if (search) base.name = { $regex: search, $options: 'i' };
  return base;
};

export const getRoles = async (companyId?: string, search?: string) => {
  return Role.find(buildFilter(companyId, search)).populate('permissions').sort({ name: 1 });
};

export const getRoleById = async (id: string) => {
  return Role.findById(id).populate('permissions');
};

export const updateRole = async (id: string, data: Partial<IRole>) => {
  return Role.findByIdAndUpdate(id, data, { new: true }).populate('permissions');
};

export const deleteRole = async (id: string) => {
  return Role.findByIdAndDelete(id);
};
