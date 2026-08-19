import { Permission } from './permission.model';
import type { IPermission } from './permission.types';

export const createPermission = async (data: Partial<IPermission>) => {
  const p = new Permission(data);
  return await p.save();
};

export const getPermissions = async (search?: string) => {
  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { key: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  return Permission.find(filter).sort({ name: 1 });
};

export const getPermissionById = async (id: string) => {
  return Permission.findById(id);
};

export const updatePermission = async (id: string, data: Partial<IPermission>) => {
  return Permission.findByIdAndUpdate(id, data, { new: true });
};

export const deletePermission = async (id: string) => {
  return Permission.findByIdAndDelete(id);
};
