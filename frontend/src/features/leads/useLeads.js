import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await api.get('/leads');
      return response.data.data;
    }
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (leadData) => {
      const response = await api.post('/leads', leadData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, leadData }) => {
      const response = await api.put(`/leads/${id}`, leadData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
};
