import type { SellerFormValues } from '../types/seller.types';
import api from '../../../services/api/axios';

export const getSellersApi = async (params: { page?: number; perPage?: number; search?: string } = {}) => {
  const response = await api.get('/api/v1/sellers', { params });
  return response.data;
};

export const getSellerByIdApi = async (id: string) => {
  const response = await api.get(`/api/v1/sellers/${id}`);
  return response.data;
};

export const addSellerApi = async (payload: SellerFormValues) => {
  const response = await api.post('/api/v1/sellers', payload);
  return response.data;
};

export const updateSellerApi = async (id: string, payload: SellerFormValues) => {
  const response = await api.put(`/api/v1/sellers/${id}`, payload);
  return response.data;
};

export const deleteSellerApi = async (id: string) => {
  const response = await api.delete(`/api/v1/sellers/${id}`);
  return response.data;
};
