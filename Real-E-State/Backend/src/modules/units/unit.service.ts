import { ApiError } from '../../common/exceptions/ApiError';

import * as repository from './unit.repository';
import type { IUnit } from './unit.types';

export const createUnit = async (data: Partial<IUnit>) => {
  return await repository.createUnit(data);
};

export const getUnits = async (projectId?: string, towerId?: string, search?: string) => {
  return await repository.getUnits(projectId, towerId, search);
};

export const getUnitById = async (id: string) => {
  const u = await repository.getUnitById(id);
  if (!u) {
    throw new ApiError('Unit not found', 404);
  }
  return u;
};

export const updateUnit = async (id: string, data: Partial<IUnit>) => {
  const u = await repository.updateUnit(id, data);
  if (!u) {
    throw new ApiError('Unit not found', 404);
  }
  return u;
};

export const deleteUnit = async (id: string) => {
  const u = await repository.deleteUnit(id);
  if (!u) {
    throw new ApiError('Unit not found', 404);
  }
  return u;
};
