import type { AddLeadPayload, Lead, UpdateLeadPayload } from '../types/lead.types';
import api from '../../../services/api/axios';

export const getLeadsApi = async (
  params: { page?: number; perPage?: number; search?: string } = {}
): Promise<{ success: boolean; message: string; data: { leads: Lead[]; total: number; page: number; totalPages: number } }> => {
  const response = await api.get('/api/v1/leads', { params });
  return response.data;
};

export const getLeadByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: Lead }> => {
  const response = await api.get(`/api/v1/leads/${id}`);
  return response.data;
};

export const addLeadApi = async (payload: AddLeadPayload): Promise<{ success: boolean; message: string; data: Lead }> => {
  const response = await api.post('/api/v1/leads', payload);
  return response.data;
};

export const updateLeadApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateLeadPayload;
}): Promise<{ success: boolean; message: string; data: Lead }> => {
  const response = await api.put(`/api/v1/leads/${id}`, payload);
  return response.data;
};

export const deleteLeadApi = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/leads/${id}`);
};
