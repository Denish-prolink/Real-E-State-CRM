import type { AddUnitPayload, Unit, UpdateUnitPayload } from '../types/unit.types';
import api from '../../../services/api/axios';

export const getUnitsApi = async (
  params: { projectId?: string; towerId?: string; search?: string } = {}
): Promise<{ success: boolean; message: string; data: Unit[] }> => {
  const response = await api.get('/api/v1/units', { params });
  return response.data;
};

export const getUnitByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: Unit }> => {
  const response = await api.get(`/api/v1/units/${id}`);
  return response.data;
};

export const addUnitApi = async (payload: AddUnitPayload): Promise<{ success: boolean; message: string; data: Unit }> => {
  const response = await api.post('/api/v1/units', payload);
  return response.data;
};

export const updateUnitApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateUnitPayload;
}): Promise<{ success: boolean; message: string; data: Unit }> => {
  const response = await api.put(`/api/v1/units/${id}`, payload);
  return response.data;
};

export const deleteUnitApi = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/units/${id}`);
};
