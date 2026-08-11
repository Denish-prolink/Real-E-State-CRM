import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getCompanyId } from '../../middlewares/auth.middleware';

import {
  getBuyReportData,
  getProductsReportData,
  getProfitLossData,
  getSellReportData,
} from './report.service';

export const getProfitLossController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const data = await getProfitLossData(companyId);
  return successResponse(res, 'Profit/Loss data fetched successfully', data);
};

export const getProductsReportController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const data = await getProductsReportData(companyId);
  return successResponse(res, 'Products report data fetched successfully', data);
};

export const getSellReportController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const data = await getSellReportData(companyId);
  return successResponse(res, 'Sell report data fetched successfully', data);
};

export const getBuyReportController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const data = await getBuyReportData(companyId);
  return successResponse(res, 'Buy report data fetched successfully', data);
};
