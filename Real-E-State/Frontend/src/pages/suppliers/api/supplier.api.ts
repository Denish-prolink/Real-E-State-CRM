import type { SupplierFormValues } from '../types/supplier.types';
import api from '../../../services/api/axios';

export const addSupplierApi = async (
  payload: SupplierFormValues
): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.post("api/v1/suppliers", payload);
  return response.data;
};

export const getSuppliersApi = async (params: { page?: number; perPage?: number; search?: string } = {}): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get("api/v1/suppliers", { params });
  return response.data;
};

export const getSupplierByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get(`api/v1/suppliers/${id}`);
  return response.data;
};

export const updateSupplierApi = async (
  id: string,
  payload: SupplierFormValues
): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.put(`api/v1/suppliers/${id}`, payload);
  return response.data;
};

export const deleteSupplierApi = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`api/v1/suppliers/${id}`);
  return response.data;
};
