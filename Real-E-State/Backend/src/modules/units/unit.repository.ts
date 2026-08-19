import { Unit } from './unit.model';
import type { IUnit } from './unit.types';

export const createUnit = async (data: Partial<IUnit>) => {
  const u = new Unit(data);
  return await u.save();
};

const buildFilter = (projectId?: string, towerId?: string, search?: string) => {
  const base: any = {};
  if (projectId) {
    base.projectId = projectId;
  }
  if (towerId) {
    base.towerId = towerId;
  }
  if (search) {
    base.unitNumber = { $regex: search, $options: 'i' };
  }
  return base;
};

export const getUnits = async (projectId?: string, towerId?: string, search?: string) => {
  return Unit.find(buildFilter(projectId, towerId, search))
    .populate('projectId', 'name')
    .populate('towerId', 'name')
    .sort({ unitNumber: 1 });
};

export const getUnitById = async (id: string) => {
  return Unit.findById(id);
};

export const updateUnit = async (id: string, data: Partial<IUnit>) => {
  return Unit.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUnit = async (id: string) => {
  return Unit.findByIdAndDelete(id);
};
