import { ApiError } from '../../common/exceptions/ApiError';

import {
  countCategories,
  createCategory,
  deleteCategory,
  findCategories,
  findCategoryById,
  findCategoryByName,
  updateCategory,
} from './category.repository';
import type { ICategoryPayload } from './category.types';

export const addCategory = async (payload: ICategoryPayload & { companyId: string }) => {
  const existingCategory = await findCategoryByName(payload.name, payload.companyId);
  if (existingCategory) {
    throw new ApiError('Category with this name already exists', 409);
  }

  return createCategory(payload);
};

export const getCategoriesList = async (
  companyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const [categories, total] = await Promise.all([
    findCategories(companyId, page, perPage, search),
    countCategories(companyId, search),
  ]);
  return {
    categories,
    total,
    page,
    perPage,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getCategoryById = async (id: string, companyId: string) => {
  const category = await findCategoryById(id, companyId);
  if (!category) {
    throw new ApiError('Category not found', 404);
  }
  return category;
};

export const updateCategoryDetails = async (
  id: string,
  payload: Partial<ICategoryPayload>,
  companyId: string,
) => {
  const category = await findCategoryById(id, companyId);
  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  if (payload.name) {
    const existingCategory = await findCategoryByName(payload.name, companyId);
    if (existingCategory && existingCategory._id.toString() !== id) {
      throw new ApiError('Category with this name already exists', 409);
    }
  }

  return updateCategory(id, payload, companyId);
};

export const removeCategory = async (id: string, companyId: string) => {
  const category = await findCategoryById(id, companyId);
  if (!category) {
    throw new ApiError('Category not found', 404);
  }
  return deleteCategory(id, companyId);
};
