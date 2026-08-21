import { ApiError } from '../../common/exceptions/ApiError';

import * as repository from './project.repository';
import type { IProject } from './project.types';

export const createProject = async (data: Partial<IProject> & { agencyId: string }) => {
  return await repository.createProject(data);
};

export const getProjects = async (agencyId: string, search?: string) => {
  return await repository.getProjects(agencyId, search);
};

export const getProjectById = async (id: string, agencyId: string) => {
  const p = await repository.getProjectById(id, agencyId);
  if (!p) throw new ApiError('Project not found', 404);
  return p;
};

export const updateProject = async (id: string, data: Partial<IProject>, agencyId: string) => {
  const p = await repository.updateProject(id, data, agencyId);
  if (!p) throw new ApiError('Project not found', 404);
  return p;
};

export const deleteProject = async (id: string, agencyId: string) => {
  const p = await repository.deleteProject(id, agencyId);
  if (!p) throw new ApiError('Project not found', 404);
  return p;
};
