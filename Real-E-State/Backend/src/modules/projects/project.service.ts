import { ApiError } from '../../common/exceptions/ApiError';
import type { IProject } from './project.types';
import * as repository from './project.repository';

export const createProject = async (data: Partial<IProject> & { companyId: string }) => {
  return await repository.createProject(data);
};

export const getProjects = async (companyId: string, search?: string) => {
  return await repository.getProjects(companyId, search);
};

export const getProjectById = async (id: string, companyId: string) => {
  const p = await repository.getProjectById(id, companyId);
  if (!p) throw new ApiError('Project not found', 404);
  return p;
};

export const updateProject = async (id: string, data: Partial<IProject>, companyId: string) => {
  const p = await repository.updateProject(id, data, companyId);
  if (!p) throw new ApiError('Project not found', 404);
  return p;
};

export const deleteProject = async (id: string, companyId: string) => {
  const p = await repository.deleteProject(id, companyId);
  if (!p) throw new ApiError('Project not found', 404);
  return p;
};
