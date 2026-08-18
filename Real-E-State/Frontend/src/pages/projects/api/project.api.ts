import type { AddProjectPayload, Project, UpdateProjectPayload } from '../types/project.types';
import api from '../../../services/api/axios';

export const getProjectsApi = async (
  params: { search?: string } = {}
): Promise<{ success: boolean; message: string; data: Project[] }> => {
  const response = await api.get('/api/v1/projects', { params });
  return response.data;
};

export const getProjectByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: Project }> => {
  const response = await api.get(`/api/v1/projects/${id}`);
  return response.data;
};

export const addProjectApi = async (payload: AddProjectPayload): Promise<{ success: boolean; message: string; data: Project }> => {
  const response = await api.post('/api/v1/projects', payload);
  return response.data;
};

export const updateProjectApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateProjectPayload;
}): Promise<{ success: boolean; message: string; data: Project }> => {
  const response = await api.put(`/api/v1/projects/${id}`, payload);
  return response.data;
};

export const deleteProjectApi = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/projects/${id}`);
};
