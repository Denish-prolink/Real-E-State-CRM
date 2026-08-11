import type { AddOrderPayload, Order, UpdateOrderPayload } from '../types/order.types';

import api from '../../../services/api/axios';

export const getOrdersApi = async (params: { page?: number; perPage?: number; orderType?: string; search?: string } = {}): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get('/api/v1/orders', { params });
  return response.data;
};

export const getOrderByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: Order }> => {
  const response = await api.get(`/api/v1/orders/${id}`);
  return response.data;
};

export const addOrderApi = async (payload: AddOrderPayload): Promise<{ success: boolean; message: string; data: Order }> => {
  const response = await api.post('/api/v1/orders', payload);
  return response.data;
};

export const updateOrderApi = async ({ id, payload }: { id: string; payload: UpdateOrderPayload }): Promise<{ success: boolean; message: string; data: Order }> => {
  const response = await api.put(`/api/v1/orders/${id}`, payload);
  return response.data;
};

export const deleteOrderApi = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/orders/${id}`);
};
