import type { BuyerFormValues } from '../types/buyer.types';
import api from '../../../services/api/axios';

export const getBuyersApi = async (params: { page?: number; perPage?: number; search?: string } = {}) => {
  const response = await api.get('/api/v1/buyers', { params });
  return response.data;
};

export const getBuyerByIdApi = async (id: string) => {
  const response = await api.get(`/api/v1/buyers/${id}`);
  return response.data;
};

export const addBuyerApi = async (payload: BuyerFormValues) => {
  const response = await api.post('/api/v1/buyers', payload);
  return response.data;
};

export const updateBuyerApi = async (id: string, payload: BuyerFormValues) => {
  const response = await api.put(`/api/v1/buyers/${id}`, payload);
  return response.data;
};

export const deleteBuyerApi = async (id: string) => {
  const response = await api.delete(`/api/v1/buyers/${id}`);
  return response.data;
};
