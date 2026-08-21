import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as service from './tower.service';

export const createTower = async (req: AuthenticatedRequest, res: Response) => {
  const tower = await service.createTower(req.body);
  return successResponse(res, 'Tower created successfully', tower, 201);
};

export const getTowers = async (req: AuthenticatedRequest, res: Response) => {
  const projectId = (req.query.projectId as string) || undefined;
  const towers = await service.getTowers(projectId);
  return successResponse(res, 'Towers retrieved successfully', towers);
};

export const getTowerById = async (req: AuthenticatedRequest, res: Response) => {
  const tower = await service.getTowerById(req.params.id as string);
  return successResponse(res, 'Tower retrieved successfully', tower);
};

export const updateTower = async (req: AuthenticatedRequest, res: Response) => {
  const tower = await service.updateTower(req.params.id as string, req.body);
  return successResponse(res, 'Tower updated successfully', tower);
};

export const deleteTower = async (req: AuthenticatedRequest, res: Response) => {
  await service.deleteTower(req.params.id as string);
  return successResponse(res, 'Tower deleted successfully');
};
