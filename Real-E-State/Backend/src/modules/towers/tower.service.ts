import { ApiError } from '../../common/exceptions/ApiError';

import * as repository from './tower.repository';
import type { ITower } from './tower.types';

export const createTower = async (data: Partial<ITower>) => {
  return await repository.createTower(data);
};

export const getTowers = async (projectId?: string) => {
  return await repository.getTowers(projectId);
};

export const getTowerById = async (id: string) => {
  const t = await repository.getTowerById(id);
  if (!t) {
    throw new ApiError('Tower not found', 404);
  }
  return t;
};

export const updateTower = async (id: string, data: Partial<ITower>) => {
  const t = await repository.updateTower(id, data);
  if (!t) {
    throw new ApiError('Tower not found', 404);
  }
  return t;
};

export const deleteTower = async (id: string) => {
  const t = await repository.deleteTower(id);
  if (!t) {
    throw new ApiError('Tower not found', 404);
  }
  return t;
};
