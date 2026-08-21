import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api/axios';

export interface DocumentData {
  _id?: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  relatedType?: string;
  relatedId?: string;
  uploadedBy?: any;
  createdAt?: string;
}

export const useDocuments = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: async () => {
      const response = await api.get('/documents', { params: filters });
      return response.data.data.documents || response.data.data;
    },
  });
};

export const useDocumentById = (id: string) => {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: async () => {
      const response = await api.get(`/documents/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentData: DocumentData) => {
      const response = await api.post('/documents', documentData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, documentData }: { id: string; documentData: Partial<DocumentData> }) => {
      const response = await api.put(`/documents/${id}`, documentData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/documents/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};
