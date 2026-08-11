import type { AddWarehousePayload, UpdateWarehousePayload, Warehouse } from '../types/warehouse.types';

import api from '../../../services/api/axios';

export const getWarehousesApi = async (search?: string): Promise<{ success: boolean; message: string; data: Warehouse[] }> => {
  const response = await api.get('/api/v1/warehouses', { params: { search } });
  return response.data;
};

export const getWarehouseByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: Warehouse }> => {
  const response = await api.get(`/api/v1/warehouses/${id}`);
  return response.data;
};

export const addWarehouseApi = async (payload: AddWarehousePayload): Promise<{ success: boolean; message: string; data: Warehouse }> => {
  const response = await api.post('/api/v1/warehouses', payload);
  return response.data;
};

export const updateWarehouseApi = async ({ id, payload }: { id: string; payload: UpdateWarehousePayload }): Promise<{ success: boolean; message: string; data: Warehouse }> => {
  const response = await api.put(`/api/v1/warehouses/${id}`, payload);
  return response.data;
};

export const deleteWarehouseApi = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/warehouses/${id}`);
};
