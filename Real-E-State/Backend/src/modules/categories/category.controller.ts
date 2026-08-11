import type { Response } from 'express';

import { ApiError } from '../../common/exceptions/ApiError';
import { successResponse } from '../../common/helpers/response.helper';
import type { AuthenticatedRequest } from '../../middlewares/auth.middleware';

import {
  addCategory,
  getCategoriesList,
  getCategoryById,
  removeCategory,
  updateCategoryDetails,
} from './category.service';

const getCompanyId = (req: AuthenticatedRequest): string => {
  if (req.user?.role === 'company' && req.user.companyId) {
    return req.user.companyId;
  }
  throw new ApiError('Forbidden: Company ID required', 403);
};

export const createCategoryController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const category = await addCategory({ ...req.body, companyId });
  return successResponse(res, 'Category created successfully', category, 201);
};

export const getCategoriesController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const page = req.query.page ? Math.max(1, parseInt(req.query.page as string)) : undefined;
  const perPage = req.query.perPage
    ? Math.max(1, parseInt(req.query.perPage as string))
    : undefined;
  const search = (req.query.search as string) || undefined;

  const result = await getCategoriesList(companyId, page, perPage, search);

  return successResponse(res, 'Categories fetched successfully', result);
};

export const getCategoryByIdController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const category = await getCategoryById(req.params.id as string, companyId);
  return successResponse(res, 'Category fetched successfully', category);
};

export const updateCategoryController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const category = await updateCategoryDetails(req.params.id as string, req.body, companyId);
  return successResponse(res, 'Category updated successfully', category);
};

export const deleteCategoryController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  await removeCategory(req.params.id as string, companyId);
  return successResponse(res, 'Category deleted successfully');
};
