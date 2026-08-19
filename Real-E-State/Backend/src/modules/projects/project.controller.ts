import type { Response } from 'express';
import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';
import * as service from './project.service';

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const project = await service.createProject({ ...req.body, agencyId });
  return successResponse(res, 'Project created successfully', project, 201);
};

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const search = (req.query.search as string) || undefined;
  const projects = await service.getProjects(agencyId, search);
  return successResponse(res, 'Projects retrieved successfully', projects);
};

export const getProjectById = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const project = await service.getProjectById(req.params.id as string, agencyId);
  return successResponse(res, 'Project retrieved successfully', project);
};

export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const project = await service.updateProject(req.params.id as string, req.body, agencyId);
  return successResponse(res, 'Project updated successfully', project);
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await service.deleteProject(req.params.id as string, agencyId);
  return successResponse(res, 'Project deleted successfully');
};
