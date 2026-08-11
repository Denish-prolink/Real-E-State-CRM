import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getCompanyId } from '../../middlewares/auth.middleware';

import { addSku, getSkuById, getSkusList, removeSku, updateSkuDetails } from './sku.service';

export const createSkuController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const sku = await addSku({ ...req.body, companyId });
  return successResponse(res, 'SKU created successfully', sku, 201);
};

export const getSkusController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const page = req.query.page ? Math.max(1, parseInt(req.query.page as string)) : undefined;
  const perPage = req.query.perPage
    ? Math.max(1, parseInt(req.query.perPage as string))
    : undefined;
  const search = (req.query.search as string) || undefined;

  const result = await getSkusList(companyId, page, perPage, search);

  return successResponse(res, 'SKUs fetched successfully', result);
};

export const getSkuByIdController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const sku = await getSkuById(req.params.id as string, companyId);
  return successResponse(res, 'SKU fetched successfully', sku);
};

export const updateSkuController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const sku = await updateSkuDetails(req.params.id as string, req.body, companyId);
  return successResponse(res, 'SKU updated successfully', sku);
};

export const deleteSkuController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  await removeSku(req.params.id as string, companyId);
  return successResponse(res, 'SKU deleted successfully');
};
