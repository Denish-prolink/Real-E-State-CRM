import { Project } from './project.model';
import type { IProject } from './project.types';

export const createProject = async (data: Partial<IProject> & { agencyId: string }) => {
  const p = new Project(data);
  return await p.save();
};

const buildFilter = (agencyId: string, search?: string) => {
  const base: any = { agencyId };
  if (search) base.name = { $regex: search, $options: 'i' };
  return base;
};

export const getProjects = async (agencyId: string, search?: string) => {
  return Project.find(buildFilter(agencyId, search)).sort({ name: 1 });
};

export const getProjectById = async (id: string, agencyId: string) => {
  return Project.findOne({ _id: id, agencyId });
};

export const updateProject = async (id: string, data: Partial<IProject>, agencyId: string) => {
  return Project.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deleteProject = async (id: string, agencyId: string) => {
  return Project.findOneAndDelete({ _id: id, agencyId });
};
