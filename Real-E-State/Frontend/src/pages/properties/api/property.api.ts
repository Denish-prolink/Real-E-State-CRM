import type { AddPropertyPayload, Property, UpdatePropertyPayload } from '../types/property.types';
import api from '../../../services/api/axios';

export const getPropertiesApi = async (
  params: Record<string, any> = {}
): Promise<{ success: boolean; message: string; data: Property[] }> => {
  const response = await api.get('/api/v1/properties', { params });
  return response.data;
};

export const getPropertyByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: Property }> => {
  const response = await api.get(`/api/v1/properties/${id}`);
  return response.data;
};

export const addPropertyApi = async (payload: AddPropertyPayload | FormData): Promise<{ success: boolean; message: string; data: Property }> => {
  const response = await api.post('/api/v1/properties', payload);
  return response.data;
};

export const updatePropertyApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdatePropertyPayload | FormData;
}): Promise<{ success: boolean; message: string; data: Property }> => {
  const response = await api.put(`/api/v1/properties/${id}`, payload);
  return response.data;
};

export const deletePropertyApi = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/properties/${id}`);
};
