import type { SkuFormValues } from '../types/sku.types';
import api from '../../../services/api/axios';

export const addSkuApi = async (
  payload: SkuFormValues
): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.post("api/v1/skus", payload);
  return response.data;
};

export const getSkusApi = async (params: { page?: number; perPage?: number; search?: string } = {}): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get("api/v1/skus", { params });
  return response.data;
};

export const getSkuByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get(`api/v1/skus/${id}`);
  return response.data;
};

export const updateSkuApi = async (
  id: string,
  payload: SkuFormValues
): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.put(`api/v1/skus/${id}`, payload);
  return response.data;
};

export const deleteSkuApi = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`api/v1/skus/${id}`);
  return response.data;
};
