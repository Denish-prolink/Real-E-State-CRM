import { Tower } from './tower.model';
import type { ITower } from './tower.types';

export const createTower = async (data: Partial<ITower>) => {
  const t = new Tower(data);
  return await t.save();
};

export const getTowers = async (projectId?: string) => {
  const filter = projectId ? { projectId } : {};
  return Tower.find(filter).populate('projectId', 'name').sort({ name: 1 });
};

export const getTowerById = async (id: string) => {
  return Tower.findById(id).populate('projectId', 'name');
};

export const updateTower = async (id: string, data: Partial<ITower>) => {
  return Tower.findByIdAndUpdate(id, data, { new: true });
};

export const deleteTower = async (id: string) => {
  return Tower.findByIdAndDelete(id);
};
