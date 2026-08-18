import { Project } from './project.model';
import type { IProject } from './project.types';

export const createProject = async (data: Partial<IProject> & { companyId: string }) => {
  const p = new Project(data);
  return await p.save();
};

const buildFilter = (companyId: string, search?: string) => {
  const base: any = { companyId };
  if (search) base.name = { $regex: search, $options: 'i' };
  return base;
};

export const getProjects = async (companyId: string, search?: string) => {
  return Project.find(buildFilter(companyId, search)).sort({ name: 1 });
};

export const getProjectById = async (id: string, companyId: string) => {
  return Project.findOne({ _id: id, companyId });
};

export const updateProject = async (id: string, data: Partial<IProject>, companyId: string) => {
  return Project.findOneAndUpdate({ _id: id, companyId }, data, { new: true });
};

export const deleteProject = async (id: string, companyId: string) => {
  return Project.findOneAndDelete({ _id: id, companyId });
};
