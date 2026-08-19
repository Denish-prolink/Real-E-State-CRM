import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as service from './seller.service';

export const createSeller = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const seller = await service.createSeller({ ...req.body, agencyId });
  return successResponse(res, 'Seller created successfully', seller, 201);
};

export const getSellers = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const page = req.query.page ? Math.max(1, parseInt(req.query.page as string)) : undefined;
  const perPage = req.query.perPage
    ? Math.max(1, parseInt(req.query.perPage as string))
    : undefined;
  const search = (req.query.search as string) || undefined;

  const result = await service.getSellers(agencyId, page, perPage, search);
  return successResponse(res, 'Sellers retrieved successfully', result);
};

export const getSellerById = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const seller = await service.getSellerById(req.params.id as string, agencyId);
  return successResponse(res, 'Seller retrieved successfully', seller);
};

export const updateSeller = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const seller = await service.updateSeller(req.params.id as string, req.body, agencyId);
  return successResponse(res, 'Seller updated successfully', seller);
};

export const deleteSeller = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await service.deleteSeller(req.params.id as string, agencyId);
  return successResponse(res, 'Seller deleted successfully');
};
