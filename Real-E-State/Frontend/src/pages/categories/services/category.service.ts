import { addCategoryApi, getCategoriesApi, updateCategoryApi, deleteCategoryApi } from '../api/category.api';
import type { CategoryFormValues } from '../types/category.types';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const addCategory = async (data: CategoryFormValues) => {
  try {
    const response = await addCategoryApi(data);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to add category. Please try again.', { cause: error });
  }
};

export const getCategories = async (params: { page?: number; perPage?: number; search?: string } = {}) => {
  try {
    const response = await getCategoriesApi(params);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to fetch categories. Please try again.', { cause: error });
  }
};

export const updateCategory = async ({ id, data }: { id: string; data: CategoryFormValues }) => {
  try {
    const response = await updateCategoryApi(id, data);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to update category. Please try again.', { cause: error });
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await deleteCategoryApi(id);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to delete category. Please try again.', { cause: error });
  }
};
