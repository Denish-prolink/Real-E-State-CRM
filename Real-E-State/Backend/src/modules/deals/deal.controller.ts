import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as service from './deal.service';

export const createDeal = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const deal = await service.createDealService(agencyId, req.body);
  return successResponse(res, 'Deal created successfully', deal, 201);
};

export const getDeals = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const deals = await service.getDealsService(agencyId, req.query);
  return successResponse(res, 'Deals retrieved successfully', deals);
};

export const getDealById = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const deal = await service.getDealByIdService(req.params.id as string, agencyId);
  return successResponse(res, 'Deal retrieved successfully', deal);
};

export const updateDeal = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const deal = await service.updateDealService(req.params.id as string, agencyId, req.body);
  return successResponse(res, 'Deal updated successfully', deal);
};

export const deleteDeal = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await service.deleteDealService(req.params.id as string, agencyId);
  return successResponse(res, 'Deal deleted successfully');
};
