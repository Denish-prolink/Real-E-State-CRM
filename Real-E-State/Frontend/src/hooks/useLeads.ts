import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api/axios';

export interface LeadData {
  _id?: string;
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  source?: string;
  status?: string;
  priority?: string;
  budget?: number;
  propertyType?: string;
  location?: string;
  bedrooms?: number;
  area?: number;
  notes?: string;
}

export const useLeads = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const response = await api.get('/leads', { params: filters });
      return response.data.data;
    },
  });
};

export const useLeadById = (id: string) => {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: async () => {
      const response = await api.get(`/leads/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (leadData: LeadData) => {
      const response = await api.post('/leads', leadData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, leadData }: { id: string; leadData: Partial<LeadData> }) => {
      const response = await api.put(`/leads/${id}`, leadData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/leads/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
