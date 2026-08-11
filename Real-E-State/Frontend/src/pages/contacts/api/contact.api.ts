import type { AddContactPayload, Contact, UpdateContactPayload } from '../types/contact.types';

import api from '../../../services/api/axios';

export const getContactsApi = async (params: { page?: number; perPage?: number; search?: string } = {}): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get('/api/v1/contacts', { params });
  return response.data;
};

export const getContactByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: Contact }> => {
  const response = await api.get(`/api/v1/contacts/${id}`);
  return response.data;
};

export const addContactApi = async (payload: AddContactPayload): Promise<{ success: boolean; message: string; data: Contact }> => {
  const response = await api.post('/api/v1/contacts', payload);
  return response.data;
};

export const updateContactApi = async ({ id, payload }: { id: string; payload: UpdateContactPayload }): Promise<{ success: boolean; message: string; data: Contact }> => {
  const response = await api.put(`/api/v1/contacts/${id}`, payload);
  return response.data;
};

export const deleteContactApi = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/contacts/${id}`);
};
