import type { CategoryFormValues } from '../types/category.types';
import api from '../../../services/api/axios';

export const addCategoryApi = async (
  payload: CategoryFormValues
): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.post("api/v1/categories", payload);
  return response.data;
};

export const getCategoriesApi = async (params: { page?: number; perPage?: number; search?: string } = {}): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get("api/v1/categories", { params });
  return response.data;
};

export const getCategoryByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get(`api/v1/categories/${id}`);
  return response.data;
};

export const updateCategoryApi = async (
  id: string,
  payload: CategoryFormValues
): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.put(`api/v1/categories/${id}`, payload);
  return response.data;
};

export const deleteCategoryApi = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`api/v1/categories/${id}`);
  return response.data;
};
