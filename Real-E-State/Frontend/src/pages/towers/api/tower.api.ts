import type { AddTowerPayload, Tower, UpdateTowerPayload } from '../types/tower.types';
import api from '../../../services/api/axios';

export const getTowersApi = async (
  params: { projectId?: string } = {}
): Promise<{ success: boolean; message: string; data: Tower[] }> => {
  const response = await api.get('/api/v1/towers', { params });
  return response.data;
};

export const getTowerByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: Tower }> => {
  const response = await api.get(`/api/v1/towers/${id}`);
  return response.data;
};

export const addTowerApi = async (payload: AddTowerPayload): Promise<{ success: boolean; message: string; data: Tower }> => {
  const response = await api.post('/api/v1/towers', payload);
  return response.data;
};

export const updateTowerApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateTowerPayload;
}): Promise<{ success: boolean; message: string; data: Tower }> => {
  const response = await api.put(`/api/v1/towers/${id}`, payload);
  return response.data;
};

export const deleteTowerApi = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/towers/${id}`);
};
