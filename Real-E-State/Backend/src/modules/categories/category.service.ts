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

export const addCategory = async (payload: ICategoryPayload & { agencyId: string }) => {
  const existingCategory = await findCategoryByName(payload.name, payload.agencyId);
  if (existingCategory) {
    throw new ApiError('Category with this name already exists', 409);
  }

  return createCategory(payload);
};

export const getCategoriesList = async (
  agencyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const [categories, total] = await Promise.all([
    findCategories(agencyId, page, perPage, search),
    countCategories(agencyId, search),
  ]);
  return {
    categories,
    total,
    page,
    perPage,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getCategoryById = async (id: string, agencyId: string) => {
  const category = await findCategoryById(id, agencyId);
  if (!category) {
    throw new ApiError('Category not found', 404);
  }
  return category;
};

export const updateCategoryDetails = async (
  id: string,
  payload: Partial<ICategoryPayload>,
  agencyId: string,
) => {
  const category = await findCategoryById(id, agencyId);
  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  if (payload.name) {
    const existingCategory = await findCategoryByName(payload.name, agencyId);
    if (existingCategory && existingCategory._id.toString() !== id) {
      throw new ApiError('Category with this name already exists', 409);
    }
  }

  return updateCategory(id, payload, agencyId);
};

export const removeCategory = async (id: string, agencyId: string) => {
  const category = await findCategoryById(id, agencyId);
  if (!category) {
    throw new ApiError('Category not found', 404);
  }
  return deleteCategory(id, agencyId);
};
