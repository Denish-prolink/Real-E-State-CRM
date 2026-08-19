import { ApiError } from '../../common/exceptions/ApiError';
import type { IProject } from './project.types';
import * as repository from './project.repository';

export const createProject = async (data: Partial<IProject> & { agencyId: string | undefined }) => {
  return await repository.createProject(data);
};

export const getProjects = async (agencyId: string | undefined, search?: string) => {
  return await repository.getProjects(agencyId, search);
};

export const getProjectById = async (id: string, agencyId: string | undefined) => {
  const p = await repository.getProjectById(id, agencyId);
  if (!p) throw new ApiError('Project not found', 404);
  return p;
};

export const updateProject = async (id: string, data: Partial<IProject>, agencyId: string | undefined) => {
  const p = await repository.updateProject(id, data, agencyId);
  if (!p) throw new ApiError('Project not found', 404);
  return p;
};

export const deleteProject = async (id: string, agencyId: string | undefined) => {
  const p = await repository.deleteProject(id, agencyId);
  if (!p) throw new ApiError('Project not found', 404);
  return p;
};
