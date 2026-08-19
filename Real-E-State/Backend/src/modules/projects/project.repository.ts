import { Project } from './project.model';
import type { IProject } from './project.types';

export const createProject = async (data: Partial<IProject> & { agencyId: string | undefined }) => {
  const p = new Project(data);
  return await p.save();
};

const buildFilter = (agencyId: string | undefined, search?: string) => {
  const base: any = { agencyId };
  if (search) base.name = { $regex: search, $options: 'i' };
  return base;
};

export const getProjects = async (agencyId: string | undefined, search?: string) => {
  return Project.find(buildFilter(agencyId, search)).sort({ name: 1 });
};

export const getProjectById = async (id: string, agencyId: string | undefined) => {
  return Project.findOne({ _id: id, agencyId });
};

export const updateProject = async (id: string, data: Partial<IProject>, agencyId: string | undefined) => {
  return Project.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deleteProject = async (id: string, agencyId: string | undefined) => {
  return Project.findOneAndDelete({ _id: id, agencyId });
};
