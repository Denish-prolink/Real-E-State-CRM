import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest } from '../../middlewares/auth.middleware';

import * as service from './unit.service';

export const createUnit = async (req: AuthenticatedRequest, res: Response) => {
  const unit = await service.createUnit(req.body);
  return successResponse(res, 'Unit created successfully', unit, 201);
};

export const getUnits = async (req: AuthenticatedRequest, res: Response) => {
  const projectId = req.query.projectId as string | undefined;
  const towerId = req.query.towerId as string | undefined;
  const search = (req.query.search as string) || undefined;
  const units = await service.getUnits(projectId, towerId, search);
  return successResponse(res, 'Units retrieved successfully', units);
};

export const getUnitById = async (req: AuthenticatedRequest, res: Response) => {
  const unit = await service.getUnitById(req.params.id as string);
  return successResponse(res, 'Unit retrieved successfully', unit);
};

export const updateUnit = async (req: AuthenticatedRequest, res: Response) => {
  const unit = await service.updateUnit(req.params.id as string, req.body);
  return successResponse(res, 'Unit updated successfully', unit);
};

export const deleteUnit = async (req: AuthenticatedRequest, res: Response) => {
  await service.deleteUnit(req.params.id as string);
  return successResponse(res, 'Unit deleted successfully');
};
