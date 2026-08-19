import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as service from './buyer.service';

export const createBuyer = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const buyer = await service.createBuyer({ ...req.body, agencyId });
  return successResponse(res, 'Buyer created successfully', buyer, 201);
};

export const getBuyers = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const page = req.query.page ? Math.max(1, parseInt(req.query.page as string)) : undefined;
  const perPage = req.query.perPage
    ? Math.max(1, parseInt(req.query.perPage as string))
    : undefined;
  const search = (req.query.search as string) || undefined;

  const result = await service.getBuyers(agencyId, page, perPage, search);
  return successResponse(res, 'Buyers retrieved successfully', result);
};

export const getBuyerById = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const buyer = await service.getBuyerById(req.params.id as string, agencyId);
  return successResponse(res, 'Buyer retrieved successfully', buyer);
};

export const updateBuyer = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const buyer = await service.updateBuyer(req.params.id as string, req.body, agencyId);
  return successResponse(res, 'Buyer updated successfully', buyer);
};

export const deleteBuyer = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await service.deleteBuyer(req.params.id as string, agencyId);
  return successResponse(res, 'Buyer deleted successfully');
};
