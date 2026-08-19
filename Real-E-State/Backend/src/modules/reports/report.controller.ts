import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import {
  getBuyReportData,
  getProductsReportData,
  getProfitLossData,
  getSellReportData,
} from './report.service';

export const getProfitLossController = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const data = await getProfitLossData(agencyId);
  return successResponse(res, 'Profit/Loss data fetched successfully', data);
};

export const getProductsReportController = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const data = await getProductsReportData(agencyId);
  return successResponse(res, 'Products report data fetched successfully', data);
};

export const getSellReportController = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const data = await getSellReportData(agencyId);
  return successResponse(res, 'Sell report data fetched successfully', data);
};

export const getBuyReportController = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const data = await getBuyReportData(agencyId);
  return successResponse(res, 'Buy report data fetched successfully', data);
};
