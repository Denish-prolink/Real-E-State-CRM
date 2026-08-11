import {
  addSkuApi,
  deleteSkuApi,
  getSkuByIdApi,
  getSkusApi,
  updateSkuApi,
} from '../api/sku.api';
import type { SkuFormValues } from '../types/sku.types';

export const getSkus = async (params?: { page?: number; perPage?: number; search?: string }) => {
  return getSkusApi(params);
};

export const getSkuById = async (id: string) => {
  return getSkuByIdApi(id);
};

export const addSku = async (payload: SkuFormValues) => {
  return addSkuApi(payload);
};

export const updateSku = async (id: string, payload: SkuFormValues) => {
  return updateSkuApi(id, payload);
};

export const deleteSku = async (id: string) => {
  return deleteSkuApi(id);
};
